import { isTouchDevice } from '@libs/is-touch-device';
import React, { Component, ReactNode } from 'react';
import { Point } from './types';

export interface ChartSliderProps {
  coordinateSpace: Point & { width: number };
  min: number;
  max: number;
  start: number;
  end: number;
  value: number;
  stepFunction?: (nextValue: number) => number;
  onChange: (nextValue: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  children: ReactNode;
}

interface ChartSliderState {
  position: number;
}

function getPosition(props: ChartSliderProps) {
  return (
    Math.max(
      Math.min(
        ((props.value - props.min) / (props.max - props.min)) *
          props.coordinateSpace.width,
        props.coordinateSpace.width,
      ),
      0,
    ) + props.coordinateSpace.x
  );
}

export class ChartSlider extends Component<ChartSliderProps, ChartSliderState> {
  private active: boolean = false;
  private cursorStart: number = 0;
  private thumbStart: number = 0;
  private thumbMin: number = 0;
  private thumbMax: number = Number.MAX_SAFE_INTEGER;

  private thumb!: SVGGElement;

  constructor(props: ChartSliderProps) {
    super(props);

    this.state = {
      position: getPosition(props),
    };
  }

  render() {
    const x = this.state.position;
    const y = this.props.coordinateSpace.y;

    return (
      <g
        ref={this.takeThumb}
        transform={`translate(${x} ${y})`}
        style={{
          cursor: 'pointer',
          visibility: isNaN(x) ? 'hidden' : undefined,
        }}
      >
        {this.props.children}
      </g>
    );
  }

  takeThumb = (thumb: SVGGElement) => {
    this.thumb = thumb;
  };

  componentDidMount() {
    this.startTrigger();
  }

  componentWillUnmount() {
    this.thumb.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  componentDidUpdate(
    prevProps: Readonly<ChartSliderProps>,
    prevState: Readonly<ChartSliderState>,
  ) {
    if (this.active) {
      return;
    }

    if (
      prevProps.value !== this.props.value ||
      prevProps.coordinateSpace.width !== this.props.coordinateSpace.width ||
      prevProps.coordinateSpace.x !== this.props.coordinateSpace.x
    ) {
      this.setState({
        position: getPosition(this.props),
      });
    }
  }

  startTrigger = () => {
    this.thumb.addEventListener('mousedown', this.onMouseDown);
    if (isTouchDevice()) {
      this.thumb.addEventListener('touchstart', this.onTouchStart);
    }
  };

  stopTrigger = () => {
    this.thumb.removeEventListener('mousedown', this.onMouseDown);
    this.thumb.removeEventListener('touchstart', this.onTouchStart);
  };

  isNegative = () => {
    this.thumbMin =
      ((this.props.start - this.props.min) /
        (this.props.max - this.props.min)) *
        this.props.coordinateSpace.width +
      this.props.coordinateSpace.x;
    this.thumbMax =
      ((this.props.end - this.props.min) / (this.props.max - this.props.min)) *
        this.props.coordinateSpace.width +
      this.props.coordinateSpace.x;

    return this.thumbMax - this.thumbMin < 1;
  };

  move = (moved: number) => {
    let moveTo: number = this.thumbStart + moved;

    if (moveTo < this.thumbMin) {
      moveTo = this.thumbMin;
    } else if (moveTo > this.thumbMax) {
      moveTo = this.thumbMax;
    }

    const nextRatio =
      (moveTo - this.props.coordinateSpace.x) /
      this.props.coordinateSpace.width;

    let nextValue =
      (this.props.max - this.props.min) * nextRatio + this.props.min;

    if (typeof this.props.stepFunction === 'function') {
      nextValue = this.props.stepFunction(nextValue);
      moveTo =
        ((nextValue - this.props.min) / (this.props.max - this.props.min)) *
          this.props.coordinateSpace.width +
        this.props.coordinateSpace.x;
    }

    this.setState({
      position: moveTo,
    });

    this.props.onChange(nextValue);
  };

  // ---------------------------------------------
  // touch events
  // ---------------------------------------------
  onTouchStart = (event: TouchEvent) => {
    if (event.targetTouches.length > 1) {
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchEnd);

      this.startTrigger();

      return;
    }

    if (event.targetTouches.length !== 1) return;

    if (this.props.min === this.props.max) {
      return;
    }

    if (this.isNegative()) {
      return;
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.cancelable) event.preventDefault();

    this.active = true;
    this.cursorStart = event.targetTouches[0].pageX;
    this.thumbStart = this.state.position;

    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchcancel', this.onTouchEnd);

    if (typeof this.props.onEnter === 'function') {
      this.props.onEnter();
    }
  };

  onTouchMove = (event: TouchEvent) => {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (event.targetTouches.length !== 1 || event.changedTouches.length !== 1) {
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchEnd);

      this.startTrigger();

      return;
    }

    const moved = event.targetTouches[0].pageX - this.cursorStart;

    this.move(moved);
  };

  onTouchEnd = (event: TouchEvent) => {
    if (event.cancelable) event.preventDefault();
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);

    this.startTrigger();

    if (typeof this.props.onLeave === 'function') {
      this.props.onLeave();
    }
  };

  // ---------------------------------------------
  // mouse events
  // ---------------------------------------------
  onMouseDown = (event: MouseEvent) => {
    if (this.props.min === this.props.max) {
      return;
    }

    if (this.isNegative()) {
      return;
    }

    this.active = true;
    this.cursorStart = event.screenX;
    this.thumbStart = event.offsetX;

    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.cancelable) event.preventDefault();

    this.stopTrigger();

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    if (typeof this.props.onEnter === 'function') {
      this.props.onEnter();
    }
  };

  onMouseUp = (event: MouseEvent) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.cancelable) event.preventDefault();

    this.active = false;

    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);

    this.startTrigger();

    if (typeof this.props.onLeave === 'function') {
      this.props.onLeave();
    }
  };

  onMouseMove = (event: MouseEvent) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.cancelable) event.preventDefault();

    const moved: number = event.screenX - this.cursorStart;

    this.move(moved);
  };
}

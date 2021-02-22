import { Component, ReactNode } from 'react';
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
      position:
        Math.max(
          Math.min(
            ((props.value - props.min) / (props.max - props.min)) *
              props.coordinateSpace.width,
            props.coordinateSpace.width,
          ),
          0,
        ) + props.coordinateSpace.x,
    };
  }

  render() {
    const x = this.state.position;
    const y = this.props.coordinateSpace.y;

    return (
      <g
        ref={this.takeThumb}
        transform={`translate(${x} ${y})`}
        style={{ cursor: 'pointer' }}
      >
        {this.props.children}
      </g>
    );
  }

  takeThumb = (thumb: SVGGElement) => {
    this.thumb = thumb;
  };

  componentDidMount() {
    this.thumb.addEventListener('pointerdown', this.onDown);
  }

  componentWillUnmount() {
    this.thumb.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
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
        position:
          Math.max(
            Math.min(
              ((this.props.value - this.props.min) /
                (this.props.max - this.props.min)) *
                this.props.coordinateSpace.width,
              this.props.coordinateSpace.width,
            ),
            0,
          ) + this.props.coordinateSpace.x,
      });
    }
  }

  onDown = (event: PointerEvent) => {
    if (this.props.min === this.props.max) {
      return;
    }

    this.active = true;
    this.cursorStart = event.screenX;
    this.thumbStart = event.offsetX;
    this.thumbMin =
      ((this.props.start - this.props.min) /
        (this.props.max - this.props.min)) *
        this.props.coordinateSpace.width +
      this.props.coordinateSpace.x;
    this.thumbMax =
      ((this.props.end - this.props.min) / (this.props.max - this.props.min)) *
        this.props.coordinateSpace.width +
      this.props.coordinateSpace.x;

    if (this.thumbMax - this.thumbMin < 1) {
      return;
    }

    this.thumb.removeEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointermove', this.onMove);

    if (typeof this.props.onEnter === 'function') {
      this.props.onEnter();
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  onUp = (event: PointerEvent) => {
    this.active = false;

    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
    this.thumb.addEventListener('pointerdown', this.onDown);

    if (typeof this.props.onLeave === 'function') {
      this.props.onLeave();
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  onMove = (event: PointerEvent) => {
    const moved: number = event.screenX - this.cursorStart;

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

    event.stopPropagation();
    event.stopImmediatePropagation();
  };
}

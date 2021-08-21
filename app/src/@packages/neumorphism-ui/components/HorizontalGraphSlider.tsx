import { NeumorphismTheme } from '../themes/Theme';
import React, { Component, CSSProperties, ReactElement } from 'react';
import styled, { withTheme } from 'styled-components';
import { Rect } from './HorizontalGraphBar';

export interface HorizontalGraphSliderProps {
  coordinateSpace: Rect;
  min: number;
  max: number;
  start: number;
  end: number;
  value: number;
  stepFunction?: (nextValue: number) => number;
  onChange: (nextValue: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  className?: string;
  children?: ReactElement;
  style?: CSSProperties;
}

interface HorizontalGraphSliderState {
  position: number;
}

class HorizontalGraphSliderBase extends Component<
  HorizontalGraphSliderProps,
  HorizontalGraphSliderState
> {
  private active: boolean = false;
  private cursorStart: number = 0;
  private thumbStart: number = 0;
  private thumbMin: number = 0;
  private thumbMax: number = Number.MAX_SAFE_INTEGER;

  private thumb!: HTMLDivElement;

  constructor(props: HorizontalGraphSliderProps) {
    super(props);

    this.state = {
      position: Math.max(
        Math.min(
          ((props.value - props.min) / (props.max - props.min)) *
            props.coordinateSpace.width,
          props.coordinateSpace.width,
        ),
        0,
      ),
    };
  }

  render() {
    const thumb = this.props.children ? (
      this.props.children
    ) : (
      <HorizontalGraphSliderThumb />
    );

    return (
      <div className={this.props.className} style={this.props.style}>
        <div ref={this.takeThumb} style={{ left: this.state.position }}>
          {thumb}
        </div>
      </div>
    );
  }

  takeThumb = (thumb: HTMLDivElement) => {
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
    prevProps: Readonly<HorizontalGraphSliderProps>,
    prevState: Readonly<HorizontalGraphSliderState>,
  ) {
    if (this.active) {
      return;
    }

    if (
      prevProps.value !== this.props.value ||
      prevProps.coordinateSpace.width !== this.props.coordinateSpace.width
    ) {
      this.setState({
        position: Math.max(
          Math.min(
            ((this.props.value - this.props.min) /
              (this.props.max - this.props.min)) *
              this.props.coordinateSpace.width,
            this.props.coordinateSpace.width,
          ),
          0,
        ),
      });
    }
  }

  onDown = (event: PointerEvent) => {
    if (this.props.min === this.props.max) {
      return;
    }

    this.active = true;
    this.cursorStart = event.screenX;
    this.thumbStart = this.thumb.offsetLeft;
    this.thumbMin =
      ((this.props.start - this.props.min) /
        (this.props.max - this.props.min)) *
      this.props.coordinateSpace.width;
    this.thumbMax =
      ((this.props.end - this.props.min) / (this.props.max - this.props.min)) *
      this.props.coordinateSpace.width;

    //console.warn('HorizontalGraphSlider.tsx..onDown()', JSON.stringify({
    //  min: this.props.min,
    //  max: this.props.max,
    //  thumbStart: this.thumbStart,
    //  thumbMin: this.thumbMin,
    //  thumbMax: this.thumbMax,
    //}, null, 2));

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

    const nextRatio = moveTo / this.props.coordinateSpace.width;

    let nextValue =
      (this.props.max - this.props.min) * nextRatio + this.props.min;

    if (typeof this.props.stepFunction === 'function') {
      nextValue = this.props.stepFunction(nextValue);
      moveTo =
        ((nextValue - this.props.min) / (this.props.max - this.props.min)) *
        this.props.coordinateSpace.width;
    }

    this.setState({
      position: moveTo,
    });

    this.props.onChange(nextValue);

    event.stopPropagation();
    event.stopImmediatePropagation();
  };
}

export const HorizontalGraphSliderThumb = withTheme(
  ({ theme }: { theme: NeumorphismTheme }) => (
    <svg
      width={22}
      height={22}
      style={{
        borderRadius: '50%',
        backgroundColor: theme.slider.thumb.thumbColor,
        boxShadow: '0px 0px 6px 2px rgba(0, 0, 0, 0.18)',
      }}
    >
      <circle cx={11} cy={11} r={2} fill="darkgray" />
    </svg>
  ),
);

export const HorizontalGraphSlider = styled(HorizontalGraphSliderBase)`
  position: absolute;

  left: ${({ coordinateSpace }) => coordinateSpace.x}px;
  top: ${({ coordinateSpace }) => coordinateSpace.y}px;
  width: ${({ coordinateSpace }) => coordinateSpace.width}px;
  height: ${({ coordinateSpace }) => coordinateSpace.height}px;

  > :first-child {
    width: ${({ coordinateSpace }) => coordinateSpace.height}px;
    height: ${({ coordinateSpace }) => coordinateSpace.height}px;
    transform: translateX(
      -${({ coordinateSpace }) => coordinateSpace.height / 2}px
    );

    position: absolute;
    display: grid;
    place-content: center;

    cursor: pointer;
  }
`;

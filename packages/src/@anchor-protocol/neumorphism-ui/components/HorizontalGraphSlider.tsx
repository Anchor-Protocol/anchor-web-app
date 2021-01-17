import { Component, ReactElement } from 'react';
import styled from 'styled-components';
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
      position:
        ((props.value - props.min) / (props.max - props.min)) *
        props.coordinateSpace.width,
    };
  }

  render() {
    const thumb = this.props.children ? (
      this.props.children
    ) : (
      <svg width={22} height={22}>
        <circle cx={11} cy={11} r={11} fill="rgba(0, 0, 0, 0.3)" />
        <circle cx={11} cy={11} r={8} fill="rgba(255, 255, 255, 1)" />
      </svg>
    );

    return (
      <div className={this.props.className}>
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
        position:
          ((this.props.value - this.props.min) /
            (this.props.max - this.props.min)) *
          this.props.coordinateSpace.width,
      });
    }
  }

  onDown = (event: PointerEvent) => {
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

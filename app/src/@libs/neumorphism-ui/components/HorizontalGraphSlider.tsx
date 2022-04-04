import { NeumorphismTheme } from '../themes/Theme';
import React, { Component, CSSProperties, ReactElement } from 'react';
import styled, { withTheme } from 'styled-components';
import { Rect } from './HorizontalGraphBar';
import { HorizontalGraphSliderThumbLabel } from './HorizontalGraphSliderThumbLabel';
import classNames from 'classnames';

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
  labelFormatter?: (value: number) => string;
}

interface HorizontalGraphSliderState {
  dragging: boolean;
}

class HorizontalGraphSliderBase extends Component<
  HorizontalGraphSliderProps,
  HorizontalGraphSliderState
> {
  private thumb!: HTMLDivElement;
  private slider!: HTMLDivElement;

  state = {
    dragging: false,
  };

  render() {
    const { className, style, labelFormatter, value } = this.props;

    const left = this.thumbLeft();

    return (
      <div
        className={className}
        style={style}
        onClick={this.onClick}
        ref={this.takeSlider}
      >
        <div
          ref={this.takeThumb}
          style={{
            left,
          }}
        >
          <HorizontalGraphSliderThumb />
        </div>
        {labelFormatter && (
          <HorizontalGraphSliderThumbLabel
            className={classNames('thumb-label', {
              'thumb-label-visible': this.state.dragging,
            })}
            left={left}
            label={labelFormatter(value)}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.thumb.addEventListener('pointerdown', this.onDown);
  }

  componentWillUnmount() {
    this.thumb.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
  }

  onDown = (event: PointerEvent) => {
    this.setState({ dragging: true });

    this.thumb.removeEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointermove', this.onMove);

    if (typeof this.props.onEnter === 'function') {
      this.props.onEnter();
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  onClick = (event: React.MouseEvent) => {
    this.onMove(event);
  };

  onUp = (event: PointerEvent) => {
    this.setState({ dragging: false });

    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
    this.thumb.addEventListener('pointerdown', this.onDown);

    if (typeof this.props.onLeave === 'function') {
      this.props.onLeave();
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  onMove = (event: PointerEvent | React.MouseEvent) => {
    const sliderPos = event.clientX - this.slider.getBoundingClientRect().left;
    const sliderRatio = this.boundedRatio(
      sliderPos / this.props.coordinateSpace.width,
    );

    const newValue = this.boundedValue(
      this.stepForward(this.valueRange() * sliderRatio),
    );

    this.props.onChange(newValue);
    event.stopPropagation();
  };

  takeThumb = (thumb: HTMLDivElement) => {
    this.thumb = thumb;
  };

  takeSlider = (slider: HTMLDivElement) => {
    this.slider = slider;
  };

  thumbLeft = () => {
    return (
      this.boundedRatio(this.props.value / this.valueRange()) *
      this.props.coordinateSpace.width
    );
  };

  valueRange = () => {
    return this.props.max - this.props.min;
  };

  startRatio = () => {
    return this.props.start / this.valueRange();
  };

  endRatio = () => {
    return this.props.end / this.valueRange();
  };

  boundedRatio = (ratio: number) => {
    return Math.max(this.startRatio(), Math.min(ratio, this.endRatio()));
  };

  stepForward = (prev: number) => {
    return this.props.stepFunction?.(prev) ?? prev;
  };

  boundedValue = (value: number) => {
    return Math.max(this.props.start, Math.min(value, this.props.end));
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
  cursor: pointer;

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

  .thumb-label {
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  }

  .thumb-label-visible {
    opacity: 1;
  }
`;

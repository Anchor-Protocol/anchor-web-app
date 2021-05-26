import React, { Component, ComponentType, ReactElement } from 'react';
import styled, { keyframes } from 'styled-components';
import { MultiTimer } from './MultiTimer';

export interface SnackbarProps {
  children: ReactElement;
  autoClose?: number | false;
  className?: string;
  onClose?: () => void;
  primaryId?: number;
  timer?: MultiTimer;
}

interface SnackbarState {}

export class SnackbarBase extends Component<SnackbarProps, SnackbarState> {
  static defaultProps: Partial<SnackbarProps> = {
    autoClose: 5000,
  };

  render() {
    return (
      <div
        className={this.props.className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {React.cloneElement(this.props.children, {
          close: this.onClose,
        })}
      </div>
    );
  }

  componentDidMount() {
    if (typeof this.props.autoClose === 'number' && this.props.timer) {
      this.props.timer.start(this.props.autoClose, this.onClose);
    }
  }

  componentWillUnmount() {
    this.onClose();
  }

  close = () => {
    this.onClose();
  };

  private onMouseEnter = () => {
    this.props.timer?.pause();
  };

  private onMouseLeave = () => {
    this.props.timer?.resume();
  };

  private onClose = () => {
    this.props.timer?.stop(this.onClose);

    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };
}

const entryKeyframes = keyframes`
  0% {
    opacity: 0;
  }
  
  100% {
    opacity: 1;
  }
`;

export const Snackbar: ComponentType<SnackbarProps> = styled(SnackbarBase)`
  opacity: 1;
  animation: ${entryKeyframes} 0.5s ease-out;
` as ComponentType<SnackbarProps>;

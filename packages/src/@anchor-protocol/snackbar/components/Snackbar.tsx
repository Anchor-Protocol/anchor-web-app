import React, {
  Component,
  ComponentType,
  ReactElement,
  RefObject,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { MultiTimer } from './MultiTimer';

export interface SnackbarProps {
  children: ReactElement;
  autoClose?: number | false;
  className?: string;
  onClose?: () => void;
  primaryId?: number;
  timer?: MultiTimer;
  controlRef?: RefObject<SnackbarControlRef | undefined>;
}

interface SnackbarState {
  content: ReactElement;
}

export interface SnackbarControlRef {
  close: () => void;
  updateContent: (children: ReactElement, resetTimer?: boolean) => void;
}

export class SnackbarBase extends Component<SnackbarProps, SnackbarState>
  implements SnackbarControlRef {
  static defaultProps: Partial<SnackbarProps> = {
    autoClose: 5000,
  };

  constructor(props: SnackbarProps) {
    super(props);

    this.state = {
      content: props.children,
    };
  }

  render() {
    return (
      <div
        className={this.props.className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {React.cloneElement(this.state.content, {
          close: this.onClose,
        })}
      </div>
    );
  }

  componentDidMount() {
    if (typeof this.props.autoClose === 'number' && this.props.timer) {
      this.props.timer.start(this.props.autoClose, this.onClose);
    }

    if (this.props.controlRef) {
      //@ts-ignore
      this.props.controlRef.current = this;
    }
  }

  componentWillUnmount() {
    this.onClose();

    if (this.props.controlRef) {
      //@ts-ignore
      this.props.controlRef.current = undefined;
    }
  }

  close = () => {
    this.onClose();
  };

  updateContent = (children: ReactElement, resetTimer: boolean = true) => {
    if (
      resetTimer &&
      typeof this.props.autoClose === 'number' &&
      this.props.timer
    ) {
      this.props.timer.stop(this.onClose);
      this.props.timer.start(this.props.autoClose, this.onClose);
    }

    this.setState({
      content: children,
    });

    this.forceUpdate();
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

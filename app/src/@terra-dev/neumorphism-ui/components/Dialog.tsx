import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { MessageColor } from '../themes/Theme';
import { getErrorBoundary } from './configErrorBoundary';

export interface DialogProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Message level color (e.g. warning, error...)
   *
   * @default normal
   */
  color?: MessageColor;

  /**
   * Callback when the dialog is closed by outside click or esc key...
   */
  onClose?: () => void;
}

const DialogBase = forwardRef<HTMLDivElement, DialogProps>(
  ({ onClose, color = 'normal', children, ...divProps }: DialogProps, ref) => {
    const ErrorBoundary = getErrorBoundary();

    return (
      <div {...divProps} ref={ref} data-color={color}>
        <div className="dialog-content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        {onClose && (
          <svg
            className="dialog-close-button"
            viewBox="0 0 16 16"
            onClick={onClose}
          >
            <g transform="matrix(1,0,0,1,-953.896,-435.63)">
              <g transform="matrix(0.405863,0.405863,-0.354409,0.354409,674.668,-219.158)">
                <path d="M1152.39,529.839L1187.24,529.839" />
              </g>
              <g transform="matrix(-0.405863,0.405863,-0.354409,-0.354409,1624.24,156.402)">
                <path d="M1152.39,529.839L1187.24,529.839" />
              </g>
            </g>
          </svg>
        )}

        <ScrollLock />
      </div>
    );
  },
);

const ScrollLock = createGlobalStyle`
  html {
    overflow: hidden !important;
  }
`;

const enter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
  
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const slide = keyframes`
  from {
    opacity: 0;
    transform: translateY(80%);
  }
  
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Dialog container component
 *
 * Please use with the `<Modal/>` component of the Material-UI
 *
 * ```jsx
 * <Modal open={open} onClose={() => setOpen(false)}>
 *   <Dialog onClose={() => setOpen(false)}>
 *     <h1>Title</h1>
 *     <div>Content...</div>
 *   </Dialog>
 * </Modal>
 * ```
 */
export const Dialog = styled(DialogBase)`
  background-color: ${({ theme, color = 'normal' }) =>
    theme.dialog[color].backgroundColor};

  color: ${({ theme, color = 'normal' }) => theme.dialog[color].textColor};

  outline: none;

  .dialog-content {
    margin: 60px;
  }

  .dialog-close-button {
    position: absolute;
    top: 24px;
    right: 24px;

    width: 18px;
    height: 18px;

    cursor: pointer;

    path {
      fill: none;
      stroke-width: 2px;
      stroke: ${({ theme }) => theme.dimTextColor};
    }

    &:hover {
      path {
        stroke: ${({ theme }) => theme.textColor};
      }
    }
  }

  @media (min-width: 700px) {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);

    border-radius: 20px;

    box-shadow: 0 0 33px 8px rgba(0, 0, 0, 0.4);

    animation: ${enter} 0.2s ease-out;
    transform-origin: center;
  }

  @media (max-width: 699px) {
    max-width: 100vw;
    max-height: 100vh;

    overflow-y: auto;

    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;

    padding-bottom: 40px;

    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    box-shadow: 0 0 33px 8px rgba(0, 0, 0, 0.4);

    animation: ${slide} 0.3s ease-out;

    .dialog-content {
      margin: 50px 30px 30px 30px;
    }
  }
`;

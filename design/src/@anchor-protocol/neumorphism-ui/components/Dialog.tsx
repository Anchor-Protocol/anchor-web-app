import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

export interface DialogProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onClose?: () => void;
}

function DialogBase({ onClose, children, ...divProps }: DialogProps) {
  return (
    <div {...divProps}>
      <div className="dialog-content">{children}</div>
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
    </div>
  );
}

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

export const Dialog = styled(DialogBase)`
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  
  border-radius: 20px;
  background-color: ${({theme}) => theme.dialog.backgroundColor};

  color: ${({ theme }) => theme.dialog.textColor};

  outline: none;
  box-shadow: 0 0 33px 8px rgba(0, 0, 0, 0.4);

  animation: ${enter} 0.2s ease-out;
  transform-origin: center;

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
`;

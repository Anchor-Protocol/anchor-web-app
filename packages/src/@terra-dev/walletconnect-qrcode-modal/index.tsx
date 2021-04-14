import { IQRCodeModal, IQRCodeModalOptions } from '@walletconnect/types';
import QRCode from 'qrcode.react';
import React, { createElement } from 'react';
import { render } from 'react-dom';
import useCopyClipboard from 'react-use-clipboard';
import styled, { keyframes } from 'styled-components';

export class TerraWalletconnectQrcodeModal implements IQRCodeModal {
  modalContainer: HTMLDivElement | null = null;

  private callback: (() => void) | null = null;

  setCloseCallback = (callback: () => void) => {
    this.callback = callback;
  };

  open = (
    uri: string,
    cb: () => void,
    _qrcodeModalOptions?: IQRCodeModalOptions,
  ) => {
    const modalContainer = window.document.createElement('div');

    const modal = createElement(TerraQRCodeModal, {
      uri,
      onClose: () => {
        if (this.callback) {
          this.callback();
          this.callback = null;
        }
        this.close();
      },
    });

    render(modal, modalContainer);
    window.document.querySelector('body')?.appendChild(modalContainer);

    this.modalContainer = modalContainer;
  };

  close = () => {
    if (this.modalContainer) {
      this.modalContainer.parentElement?.removeChild(this.modalContainer);
    }

    this.callback = null;
  };
}

function TerraQRCodeModalBase({
  uri,
  className,
  onClose,
}: {
  uri: string;
  className?: string;
  onClose: () => void;
}) {
  const [isCopied, setCopied] = useCopyClipboard(uri, {
    successDuration: 1000 * 5,
  });

  return (
    <div className={className}>
      <div onClick={onClose} />
      <figure>
        <QRCode value={uri} size={300} />
        <div>
          <button onClick={setCopied}>
            Copy Clipboard{isCopied ? ' (Copied)' : ''}
          </button>
        </div>
      </figure>
    </div>
  );
}

const modalEnter = keyframes`
  0% {
    opacity: 0;
  }
  
  100% {
    opacity: 1;
  }
`;

const figureEnter = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const TerraQRCodeModal = styled(TerraQRCodeModalBase)`
  position: fixed;
  z-index: 100000;

  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  display: grid;
  place-content: center;

  > div {
    position: fixed;
    z-index: -1;

    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);

    animation: ${modalEnter} 0.2s ease-in-out;
  }

  > figure {
    padding: 30px;

    border-radius: 25px;

    background-color: #ffffff;
    box-shadow: 0 4px 18px 3px rgba(0, 0, 0, 0.43);

    animation: ${figureEnter} 0.2s ease-in-out;
  }
`;

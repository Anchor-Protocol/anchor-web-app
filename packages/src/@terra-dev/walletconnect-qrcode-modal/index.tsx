import { useIsMobile } from '@terra-dev/is-mobile';
import { IQRCodeModal, IQRCodeModalOptions } from '@walletconnect/types';
import QRCode from 'qrcode.react';
import React, { createElement, useCallback, useMemo } from 'react';
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
  const isMobile = useIsMobile();

  const schemeUri = useMemo(
    () => `terrastation://wallet_connect?payload=${encodeURIComponent(uri)}`,
    [uri],
  );

  const [isCopied, setCopied] = useCopyClipboard(schemeUri, {
    successDuration: 1000 * 5,
  });

  const openTerraStationMobile = useCallback(() => {
    window.location.href = schemeUri;
  }, [schemeUri]);

  return (
    <div className={className}>
      <div onClick={onClose} />
      {isMobile ? (
        <section className="mobile">
          <h1>Wallet Connect</h1>

          <button onClick={openTerraStationMobile} className="flat-button">
            Open Terra Station Mobile
          </button>

          <div className="separator">
            <hr />
            <span>or</span>
          </div>

          <button onClick={setCopied}>
            Copy Clipboard{isCopied ? ' (Copied)' : ''}
          </button>

          <QRCode value={schemeUri} size={110} />
        </section>
      ) : (
        <section className="desktop">
          <h1>Wallet Connect</h1>

          <QRCode value={schemeUri} size={240} />

          <button onClick={setCopied}>
            Copy Clipboard{isCopied ? ' (Copied)' : ''}
          </button>
        </section>
      )}
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

const sectionEnter = keyframes`
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

  color: #000000;

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

  > section {
    border-radius: 25px;

    background-color: #ffffff;
    box-shadow: 0 4px 18px 3px rgba(0, 0, 0, 0.43);

    animation: ${sectionEnter} 0.2s ease-in-out;

    button {
      cursor: pointer;

      display: block;
      outline: none;
      background-color: transparent;
      width: 100%;
      height: 32px;
      font-size: 13px;
      letter-spacing: -0.2px;
      border-radius: 18px;
      border: solid 1px #2c2c2c;

      &.flat-button {
        border: 0;
        color: #ffffff;
        background-color: #2c2c2c;
      }
    }

    .separator {
      height: 12px;

      position: relative;

      hr {
        position: absolute;
        top: 5px;
        left: 0;
        right: 0;

        border: 0;
        border-bottom: 1px dashed #cccccc;
      }

      span {
        display: block;

        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);

        font-size: 12px;
        color: #c2c2c2;
        background-color: #ffffff;
        padding: 0 2px;
      }
    }

    &.desktop {
      padding: 50px 60px;

      h1 {
        font-size: 27px;
        font-weight: 500;

        text-align: center;

        margin-bottom: 24px;
      }

      button {
        margin-top: 20px;
      }
    }

    &.mobile {
      padding: 40px 30px;
      min-width: 320px;

      h1 {
        font-size: 22px;
        font-weight: 500;

        text-align: center;

        margin-bottom: 30px;
      }

      .separator {
        margin: 10px 0;
      }

      canvas {
        display: block;
        margin: 16px auto 0 auto;
      }
    }
  }
`;

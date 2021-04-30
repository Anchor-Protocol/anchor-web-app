import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { AccAddress } from '@terra-money/terra.js';
import { createElement, useCallback, useMemo, useState } from 'react';
import { render } from 'react-dom';
import styled, { keyframes } from 'styled-components';

interface Options {
  networks: NetworkInfo[];
  className?: string;
}

export function readonlyWalletModal({
  networks,
  className,
}: Options): Promise<ReadonlyWalletSession | null> {
  return new Promise<ReadonlyWalletSession | null>((resolve) => {
    const modalContainer = window.document.createElement('div');

    function onComplete(session: ReadonlyWalletSession | null) {
      resolve(session);
      modalContainer.parentElement?.removeChild(modalContainer);
    }

    const modal = createElement(ReadonlyWalletModal, {
      className,
      networks,
      onComplete,
    });

    render(modal, modalContainer);
    window.document.querySelector('body')?.appendChild(modalContainer);
  });
}

function ReadonlyWalletModalBase({
  networks,
  className,
  onComplete,
}: Options & { onComplete: (session: ReadonlyWalletSession | null) => void }) {
  const [chainID, setChainID] = useState<string>(() => networks[0].chainID);
  const [address, setAddress] = useState<string>('');

  const validAddress = useMemo(() => {
    return AccAddress.validate(address);
  }, [address]);

  const submit = useCallback(() => {
    const network = networks.find(
      (itemNetwork) => itemNetwork.chainID === chainID,
    );

    if (!network) return;

    onComplete({
      terraAddress: address,
      network,
    });
  }, [address, chainID, networks, onComplete]);

  return (
    <div className={className}>
      <div onClick={() => onComplete(null)} />
      <section>
        <h1>View an Address</h1>

        <label>
          <select
            value={chainID}
            onChange={({ target }) => setChainID(target.value)}
          >
            {networks.map((itemNetwork) => (
              <option key={itemNetwork.chainID}>
                {itemNetwork.name[0].toUpperCase() + itemNetwork.name.slice(1)}{' '}
                - {itemNetwork.chainID}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 10 6">
            <polyline points="1 1 5 5 9 1"></polyline>
          </svg>
        </label>

        <input
          type="text"
          value={address}
          onChange={({ target }) => setAddress(target.value)}
        />

        <button disabled={!validAddress} onClick={submit}>
          View an Address
        </button>
      </section>
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

const ReadonlyWalletModal = styled(ReadonlyWalletModalBase)`
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
    max-width: 80vw;
    width: 450px;

    border-radius: 25px;

    background-color: #ffffff;
    box-shadow: 0 4px 18px 3px rgba(0, 0, 0, 0.43);

    animation: ${sectionEnter} 0.2s ease-in-out;

    padding: 50px 60px;

    h1 {
      font-size: 27px;
      font-weight: 500;

      text-align: center;

      margin-bottom: 24px;
    }

    label {
      position: relative;

      select {
        -webkit-appearance: none;
        outline: none;
        padding: 10px 40px 10px 12px;
        width: 100%;
        border: 1px solid #2c2c2c;
        border-radius: 10px;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
      }

      svg {
        position: absolute;
        right: 12px;
        top: calc(50%);
        width: 10px;
        height: 6px;
        stroke-width: 2px;
        stroke: #2c2c2c;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
      }
    }

    input {
      margin-top: 10px;

      font-size: 13px;
      outline: none;
      border-radius: 10px;
      padding: 0 12px;
      width: 100%;
      height: 37px;
      border: 1px solid #2c2c2c;
    }

    button {
      margin-top: 20px;

      cursor: pointer;

      display: block;
      outline: none;
      width: 100%;
      height: 40px;
      font-size: 13px;
      letter-spacing: -0.2px;
      border-radius: 18px;
      border: 0;

      color: #ffffff;
      background-color: #2c2c2c;

      &:disabled {
        opacity: 0.4;
      }
    }
  }
`;

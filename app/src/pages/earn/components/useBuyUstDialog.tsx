import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@terra-dev/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import bitfinex from './assets/bitfinex.svg';
import kucoin from './assets/kucoin.svg';
import transak from './assets/transak.svg';
import { dialogStyle } from './useInsuranceCoverageDialog';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useBuyUstDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Buy UST</h1>

        <section>
          <h2>Exchanges</h2>

          <EmbossButton
            component="a"
            href="https://trading.bitfinex.com/t/TERRAUST:USD?demo=true"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Bitfinex{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={bitfinex} alt="Bitfinex" />
            </i>
          </EmbossButton>

          <EmbossButton
            component="a"
            href="https://trade.kucoin.com/USDT-UST"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              KuCoin{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={kucoin} alt="KuCoin" />
            </i>
          </EmbossButton>
        </section>

        <section>
          <h2>With Fiat</h2>

          <EmbossButton
            component="a"
            href="https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=mainnet"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Transak{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={transak} alt="Transak" />
            </i>
          </EmbossButton>
        </section>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 458px;

  ${dialogStyle};
`;

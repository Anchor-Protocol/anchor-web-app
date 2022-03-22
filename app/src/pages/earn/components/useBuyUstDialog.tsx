import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@libs/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import bitfinex from './assets/bitfinex.svg';
import kucoin from './assets/kucoin.svg';
import transak from './assets/transak.svg';
import kado from './assets/kado.svg';
import binance from './assets/binance.svg';
import ftx from './assets/ftx.svg';
import { dialogStyle } from './useInsuranceCoverageDialog';
import okex from './assets/okex.svg';

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
            href="https://www.binance.com/en/trade/UST_USDT"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Binance{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={binance} alt="Binance" />
            </i>
          </EmbossButton>

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

          <EmbossButton
            component="a"
            href="https://www.okex.com/trade-spot/ust-usdt"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              OKex{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={okex} alt="OKex" />
            </i>
          </EmbossButton>

          <EmbossButton
            component="a"
            href="https://ftx.com/trade/UST/USD"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              FTX{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={ftx} alt="FTX" />
            </i>
          </EmbossButton>
        </section>

        <section>
          <h2>With Fiat</h2>
          <EmbossButton
            component="a"
            href="https://ramp.kado.money"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Kado Ramp{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={kado} alt="Kado Ramp" />
            </i>
          </EmbossButton>
          <EmbossButton
            component="a"
            href="https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=terra"
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

  section {
    i {
      img {
        max-width: 32px;
      }
    }
  }
`;

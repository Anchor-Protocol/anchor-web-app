import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useBondBLunaExchangeRateQuery,
  useBondMintTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bLuna, Gas, Luna, u, UST } from '@anchor-protocol/types';
import { useEstimateFee, useFixedFee } from '@libs/app-provider';
import { floor } from '@libs/big-math';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useAlert } from '@libs/neumorphism-ui/components/useAlert';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { pegRecovery } from 'pages/bond/logics/pegRecovery';
import { validateBondAmount } from 'pages/bond/logics/validateBondAmount';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'LUNA', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLUNA', value: 'bluna' }];

function MintBase({ className }: MintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { contractAddress, gasPrice, constants } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const estimateFee = useEstimateFee(connectedWallet?.walletAddress);

  const [mint, mintResult] = useBondMintTx();

  const [openAlert, alertElement] = useAlert();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bondAmount, setBondAmount] = useState<Luna>('' as Luna);
  const [mintAmount, setMintAmount] = useState<bLuna>('' as bLuna);

  const [estimatedGasWanted, setEstimatedGasWanted] = useState<Gas | null>(
    null,
  );
  const [estimatedFee, setEstimatedFee] = useState<u<UST> | null>(null);

  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );
  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { state: exchangeRate, parameters } = {} } =
    useBondBLunaExchangeRateQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const pegRecoveryFee = useMemo(
    () => pegRecovery(exchangeRate, parameters),
    [exchangeRate, parameters],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const invalidBondAmount = useMemo(
    () => !!connectedWallet && validateBondAmount(bondAmount, bank),
    [bank, bondAmount, connectedWallet],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (!connectedWallet || bondAmount.length === 0) {
      return;
    }

    estimateFee([
      new MsgExecuteContract(
        connectedWallet.terraAddress,
        contractAddress.bluna.hub,
        {
          bond: {},
        },
        {
          uluna: floor(big(bondAmount).mul(MICRO)).toFixed(),
        },
      ),
    ]).then((estimated) => {
      if (estimated) {
        setEstimatedGasWanted(estimated.gasWanted);
        setEstimatedFee(
          big(estimated.txFee).mul(gasPrice.uusd).toFixed() as u<UST>,
        );
      } else {
        setEstimatedGasWanted(null);
        setEstimatedFee(null);
      }
    });
  }, [
    bondAmount,
    connectedWallet,
    constants.bondGasWanted,
    contractAddress.bluna.hub,
    estimateFee,
    fixedFee,
    gasPrice.uusd,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBondCurrency = useCallback((nextAssetCurrencyValue: string) => {
    setBondCurrency(
      assetCurrencies.find(({ value }) => nextAssetCurrencyValue === value) ??
        assetCurrencies[0],
    );
  }, []);

  const updateMintCurrency = useCallback((nextBAssetCurrencyValue: string) => {
    setMintCurrency(
      bAssetCurrencies.find(({ value }) => nextBAssetCurrencyValue === value) ??
        bAssetCurrencies[0],
    );
  }, []);

  const updateBondAmount = useCallback(
    (nextBondAmount: string) => {
      if (nextBondAmount.trim().length === 0) {
        setBondAmount('' as Luna);
        setMintAmount('' as bLuna);
      } else {
        const bondAmount: Luna = nextBondAmount as Luna;
        const mintAmount: bLuna = formatLunaInput(
          big(bondAmount).div(exchangeRate?.exchange_rate ?? 1) as bLuna<Big>,
        );

        setBondAmount(bondAmount);
        setMintAmount(mintAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const updateMintAmount = useCallback(
    (nextMintAmount: string) => {
      if (nextMintAmount.trim().length === 0) {
        setBondAmount('' as Luna);
        setMintAmount('' as bLuna);
      } else {
        const mintAmount: bLuna = nextMintAmount as bLuna;
        const bondAmount: Luna = formatLunaInput(
          big(mintAmount).mul(exchangeRate?.exchange_rate ?? 1) as Luna<Big>,
        );

        setBondAmount(bondAmount);
        setMintAmount(mintAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const init = useCallback(() => {
    setBondAmount('' as Luna);
    setMintAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    async (bondAmount: Luna) => {
      if (!connectedWallet || !mint) {
        return;
      }

      const estimated = await estimateFee([
        new MsgExecuteContract(
          connectedWallet.terraAddress,
          contractAddress.bluna.hub,
          {
            bond: {},
          },
          {
            uluna: floor(big(bondAmount).mul(MICRO)).toFixed(),
          },
        ),
      ]);

      if (estimated) {
        mint({
          bondAmount,
          gasWanted: estimated.gasWanted,
          txFee: big(estimated.txFee).mul(gasPrice.uusd).toFixed() as u<UST>,
          onTxSucceed: () => {
            init();
          },
        });
      } else {
        await openAlert({
          description: (
            <>
              Broadcasting failed,
              <br />
              please retry after some time.
            </>
          ),
          agree: 'OK',
        });
      }
    },
    [
      connectedWallet,
      contractAddress.bluna.hub,
      estimateFee,
      gasPrice.uusd,
      init,
      mint,
      openAlert,
    ],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    mintResult?.status === StreamStatus.IN_PROGRESS ||
    mintResult?.status === StreamStatus.DONE
  ) {
    return (
      <Section className={className}>
        <TxResultRenderer
          resultRendering={mintResult.value}
          onExit={() => {
            init();
            switch (mintResult.status) {
              case StreamStatus.IN_PROGRESS:
                mintResult.abort();
                break;
              case StreamStatus.DONE:
                mintResult.clear();
                break;
            }
          }}
        />
      </Section>
    );
  }

  return (
    <Section className={className}>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {pegRecoveryFee && (
        <MessageBox
          level="info"
          hide={{ id: 'mint_peg', period: 1000 * 60 * 60 * 24 * 7 }}
        >
          When exchange rate is lower than threshold,
          <br />
          protocol charges peg recovery fee for each Mint/Burn action.
        </MessageBox>
      )}

      {/* Bond (Asset) */}
      <div className="bond-description">
        <p>I want to bond</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="bond"
        gridColumns={[120, '1fr']}
        error={!!invalidBondAmount}
        leftHelperText={invalidBondAmount}
        rightHelperText={
          !!connectedWallet && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateBondAmount(
                    formatLunaInput(demicrofy(bank.tokenBalances.uLuna)),
                  )
                }
              >
                {formatLuna(demicrofy(bank.tokenBalances.uLuna))}{' '}
                {bondCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={bondCurrency}
          onChange={({ target }) => updateBondCurrency(target.value)}
          IconComponent={
            assetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={assetCurrencies.length < 2}
        >
          {assetCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>

        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBondAmount}
          value={bondAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBondAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <IconLineSeparator />

      {/* Mint (bAsset) */}
      <div className="mint-description">
        <p>and mint</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="mint"
        gridColumns={[120, '1fr']}
        error={!!invalidBondAmount}
      >
        <MuiNativeSelect
          value={mintCurrency}
          onChange={({ target }) => updateMintCurrency(target.value)}
          IconComponent={
            bAssetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={bAssetCurrencies.length < 2}
        >
          {bAssetCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBondAmount}
          value={mintAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateMintAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <TxFeeList className="receipt">
        {exchangeRate && (
          <SwapListItem
            label="Price"
            currencyA={bondCurrency.label}
            currencyB={mintCurrency.label}
            exchangeRateAB={exchangeRate.exchange_rate}
            formatExchangeRate={(ratio) => formatLuna(ratio as Luna<Big>)}
          />
        )}
        {!!pegRecoveryFee && mintAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Peg Recovery Fee</IconSpan>}>
            {formatLuna(demicrofy(pegRecoveryFee(mintAmount)))} bLUNA
          </TxFeeListItem>
        )}
        {bondAmount.length > 0 && estimatedFee && (
          <TxFeeListItem label={<IconSpan>Estimated Tx Fee</IconSpan>}>
            ≈ {formatUST(demicrofy(estimatedFee))} UST
          </TxFeeListItem>
        )}
      </TxFeeList>

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !mint ||
            bondAmount.length === 0 ||
            big(bondAmount).lte(0) ||
            !!invalidBondAmount ||
            !!invalidTxFee ||
            estimatedGasWanted === null ||
            estimatedFee === null
          }
          onClick={() => proceed(bondAmount)}
        >
          Mint
        </ActionButton>
      </ViewAddressWarning>

      {alertElement}
    </Section>
  );
}

function BlankComponent() {
  return <div />;
}

export const Mint = styled(MintBase)`
  .bond-description,
  .mint-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    color: ${({ theme }) => theme.dimTextColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .bond,
  .mint {
    margin-bottom: 30px;
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;

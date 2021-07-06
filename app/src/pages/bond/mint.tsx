import {
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bLuna, Luna } from '@anchor-protocol/types';
import {
  StakingValidator,
  useAnchorWebapp,
  useBondBLunaExchangeRateQuery,
  useBondMintTx,
  useBondValidators,
} from '@anchor-protocol/webapp-provider';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NativeSelect } from '@terra-dev/neumorphism-ui/components/NativeSelect';
import { NumberMuiInput } from '@terra-dev/neumorphism-ui/components/NumberMuiInput';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'contexts/bank';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
import { pegRecovery } from 'pages/bond/logics/pegRecovery';
import { validateBondAmount } from 'pages/bond/logics/validateBondAmount';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function MintBase({ className }: MintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const [mint, mintResult] = useBondMintTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bondAmount, setBondAmount] = useState<Luna>('' as Luna);
  const [mintAmount, setMintAmount] = useState<bLuna>('' as bLuna);

  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );
  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );

  const [selectedValidator, setSelectedValidator] =
    useState<StakingValidator | null>(null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { whitelistedValidators } = {} } = useBondValidators();

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
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidBondAmount = useMemo(
    () => !!connectedWallet && validateBondAmount(bondAmount, bank),
    [bank, bondAmount, connectedWallet],
  );

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
    setSelectedValidator(null);
  }, []);

  const proceed = useCallback(
    (bondAmount: Luna, selectedValidator: string) => {
      if (!connectedWallet || !mint) {
        return;
      }

      mint({
        bondAmount,
        validator: selectedValidator,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, init, mint],
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
                    formatLunaInput(demicrofy(bank.userBalances.uLuna)),
                  )
                }
              >
                {formatLuna(demicrofy(bank.userBalances.uLuna))}{' '}
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

      <HorizontalHeavyRuler />

      {/* Validators */}
      <NativeSelect
        className="validator"
        data-selected-value={selectedValidator?.OperatorAddress ?? ''}
        value={selectedValidator?.OperatorAddress ?? ''}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setSelectedValidator(
            whitelistedValidators?.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={whitelistedValidators?.length === 0}
      >
        <option value="">Select validator</option>
        {whitelistedValidators?.map(({ Description, OperatorAddress }) => (
          <option key={OperatorAddress} value={OperatorAddress}>
            {Description.Moniker}
          </option>
        ))}
      </NativeSelect>

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
            {formatLuna(demicrofy(pegRecoveryFee(mintAmount)))} bLuna
          </TxFeeListItem>
        )}
        {bondAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUST(demicrofy(fixedGas))} UST
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
            !selectedValidator
          }
          onClick={() =>
            selectedValidator &&
            proceed(bondAmount, selectedValidator.OperatorAddress)
          }
        >
          Mint
        </ActionButton>
      </ViewAddressWarning>
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

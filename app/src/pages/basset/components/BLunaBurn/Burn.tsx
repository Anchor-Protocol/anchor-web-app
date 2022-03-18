import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useAnchorWebapp,
  useBLunaExchangeRateQuery,
  useBondBurnTx,
} from '@anchor-protocol/app-provider';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { bLuna } from '@anchor-protocol/types';
import { createHookMsg } from '@libs/app-fns/tx/internal';
import { useEstimateFee } from '@libs/app-provider';
import { floor } from '@libs/big-math';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@libs/neumorphism-ui/components/HorizontalHeavyRuler';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import {
  SelectAndTextInputContainer,
  SelectAndTextInputContainerLabel,
} from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useAlert } from '@libs/neumorphism-ui/components/useAlert';
import { Gas, Luna, Rate, u, UST } from '@libs/types';
import { InfoOutlined } from '@material-ui/icons';
import { StreamStatus } from '@rx-stream/react';
import { Msg, MsgExecuteContract } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import debounce from 'lodash.debounce';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { pegRecovery } from '../../logics/pegRecovery';
import { validateBurnAmount } from '../../logics/validateBurnAmount';
import { BurnSwitch } from '../BurnSwitch';
import { ConvertSymbols, ConvertSymbolsContainer } from '../ConvertSymbols';
import { BurnComponent } from './types';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';

export interface BurnProps extends BurnComponent {
  className?: string;
}

export function Component({
  className,
  burnAmount,
  getAmount,
  setGetAmount,
  setBurnAmount,
  connectedWallet,
  fixedFee,
  setMode,
}: BurnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const { contractAddress, gasPrice, constants } = useAnchorWebapp();

  const estimateFee = useEstimateFee(terraWalletAddress);

  const [burn, burnResult] = useBondBurnTx();

  const [openAlert, alertElement] = useAlert();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [estimatedGasWanted, setEstimatedGasWanted] = useState<Gas | null>(
    null,
  );
  const [estimatedFee, setEstimatedFee] = useState<u<UST> | null>(null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { state: exchangeRate, parameters } = {} } =
    useBLunaExchangeRateQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const pegRecoveryFee = useMemo(
    () => pegRecovery(exchangeRate, parameters),
    [exchangeRate, parameters],
  );

  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const invalidBurnAmount = useMemo(
    () => connected && validateBurnAmount(burnAmount, bank),
    [bank, burnAmount, connected],
  );

  const estimate = useMemo(() => {
    return debounce((msgs: Msg[] | null) => {
      if (!msgs) {
        setEstimatedGasWanted(null);
        setEstimatedFee(null);
        return;
      }

      estimateFee(msgs).then((estimated) => {
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
    }, 500);
  }, [estimateFee, gasPrice.uusd]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBurnAmount = useCallback(
    (nextBurnAmount: string) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        const getAmount: Luna = formatLunaInput(
          big(burnAmount).mul(exchangeRate?.exchange_rate ?? 1) as Luna<Big>,
        );

        setGetAmount(getAmount);
        setBurnAmount(burnAmount);
      }
    },
    [exchangeRate?.exchange_rate, setBurnAmount, setGetAmount],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        const burnAmount: bLuna = formatLunaInput(
          big(getAmount).div(exchangeRate?.exchange_rate ?? 1) as bLuna<Big>,
        );

        setBurnAmount(burnAmount);
        setGetAmount(getAmount);
      }
    },
    [exchangeRate?.exchange_rate, setBurnAmount, setGetAmount],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, [setBurnAmount, setGetAmount]);

  const proceed = useCallback(
    async (burnAmount: bLuna) => {
      if (!connected || !terraWalletAddress || !burn) {
        return;
      }

      const estimated = await estimateFee([
        new MsgExecuteContract(terraWalletAddress, contractAddress.cw20.bLuna, {
          send: {
            contract: contractAddress.bluna.hub,
            amount: floor(big(burnAmount).mul(MICRO)).toFixed(),
            msg: createHookMsg({
              unbond: {},
            }),
          },
        }),
      ]);

      if (estimated) {
        burn({
          burnAmount,
          gasWanted: estimated.gasWanted,
          txFee: big(estimated.txFee).mul(gasPrice.uusd).toFixed() as u<UST>,
          exchangeRate: exchangeRate?.exchange_rate ?? ('1' as Rate<string>),
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
      burn,
      connected,
      contractAddress.bluna.hub,
      contractAddress.cw20.bLuna,
      exchangeRate,
      estimateFee,
      gasPrice.uusd,
      init,
      openAlert,
      terraWalletAddress,
    ],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (!connectedWallet || burnAmount.length === 0) {
      setEstimatedGasWanted(null);
      setEstimatedFee(null);
      estimate(null);
      return;
    }

    const amount = floor(big(burnAmount).mul(MICRO));

    if (amount.lt(0) || amount.gt(bank.tokenBalances.ubLuna ?? 0)) {
      setEstimatedGasWanted(null);
      setEstimatedFee(null);
      estimate(null);
      return;
    }

    estimate([
      new MsgExecuteContract(
        connectedWallet.terraAddress,
        contractAddress.cw20.bLuna,
        {
          send: {
            contract: contractAddress.bluna.hub,
            amount: amount.toFixed(),
            msg: createHookMsg({
              unbond: {},
            }),
          },
        },
      ),
    ]);
  }, [
    bank.tokenBalances.ubLuna,
    burnAmount,
    connectedWallet,
    constants.bondGasWanted,
    contractAddress.bluna.hub,
    contractAddress.cw20.bLuna,
    estimate,
    estimateFee,
    fixedFee,
    gasPrice.uusd,
  ]);

  useEffect(() => {
    if (burnAmount.length > 0) {
      updateBurnAmount(burnAmount);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    burnResult?.status === StreamStatus.IN_PROGRESS ||
    burnResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={burnResult.value}
        onExit={() => {
          init();
          switch (burnResult.status) {
            case StreamStatus.IN_PROGRESS:
              burnResult.abort();
              break;
            case StreamStatus.DONE:
              burnResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <div className={className}>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {pegRecoveryFee && (
        <MessageBox
          level="info"
          hide={{ id: 'burn_peg', period: 1000 * 60 * 60 * 24 * 7 }}
        >
          When exchange rate is lower than threshold,
          <br />
          protocol charges peg recovery fee for each Mint/Burn action.
        </MessageBox>
      )}

      <ConvertSymbolsContainer>
        <ConvertSymbols
          className="symbols"
          view="burn"
          fromIcon={<TokenIcon token="luna" />}
          toIcon={<TokenIcon token="bluna" />}
        />
      </ConvertSymbolsContainer>

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="burn"
        gridColumns={[140, '1fr']}
        error={!!invalidBurnAmount}
        leftHelperText={invalidBurnAmount}
        rightHelperText={
          connected && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateBurnAmount(
                    formatLunaInput(demicrofy(bank.tokenBalances.ubLuna)),
                  )
                }
              >
                {formatLuna(demicrofy(bank.tokenBalances.ubLuna))} bLuna
              </span>
            </span>
          )
        }
      >
        <SelectAndTextInputContainerLabel>
          <TokenIcon token="bluna" /> bLuna
        </SelectAndTextInputContainerLabel>
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBurnAmount}
          value={burnAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBurnAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <IconLineSeparator />

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>and get</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="gett"
        gridColumns={[140, '1fr']}
        error={!!invalidBurnAmount}
      >
        <SelectAndTextInputContainerLabel>
          <TokenIcon token="luna" /> Luna
        </SelectAndTextInputContainerLabel>
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBurnAmount}
          value={getAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateGetAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <HorizontalHeavyRuler />

      <BurnSwitch
        className="switch"
        style={{ marginBottom: 40 }}
        mode="burn"
        onChange={(mode) => mode === 'swap' && setMode('swap')}
      />

      <div className="guide" style={{ marginBottom: 40 }}>
        <h4>
          <InfoOutlined /> Burn
        </h4>
        <ul>
          <li>
            Default bLuna redemptions take at least 21 days to process. Slashing
            events during the 21 days may affect the final amount withdrawn.
          </li>
          <li>
            Redemptions are processed in 3-day batches and may take up to 24
            days.
          </li>
        </ul>
      </div>

      <TxFeeList className="receipt">
        {exchangeRate && (
          <SwapListItem
            label="Price"
            currencyA="Luna"
            currencyB="bLuna"
            initialDirection="a/b"
            exchangeRateAB={exchangeRate.exchange_rate}
            formatExchangeRate={(ratio) => formatLuna(ratio as Luna<Big>)}
          />
        )}
        {!!pegRecoveryFee && getAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Peg Recovery Fee</IconSpan>}>
            {formatLuna(demicrofy(pegRecoveryFee(getAmount)))} LUNA
          </TxFeeListItem>
        )}
        {burnAmount.length > 0 && estimatedFee && (
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
            !availablePost ||
            !connected ||
            !burn ||
            burnAmount.length === 0 ||
            big(burnAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBurnAmount ||
            estimatedGasWanted === null ||
            estimatedFee === null
          }
          onClick={() => proceed(burnAmount)}
        >
          Burn
        </ActionButton>
      </ViewAddressWarning>

      {alertElement}
    </div>
  );
}

const StyledComponent = styled(Component)`
  .burn,
  .gett {
    img {
      font-size: 12px;
    }
  }
`;

export const Burn = fixHMR(StyledComponent);

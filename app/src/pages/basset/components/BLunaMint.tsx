import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useAnchorWebapp,
  useBLunaExchangeRateQuery,
  useBondMintTx,
} from '@anchor-protocol/app-provider';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { bLuna, Gas, u, UST } from '@anchor-protocol/types';
import { useEstimateFee, useFixedFee } from '@libs/app-provider';
import { floor } from '@libs/big-math';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { Section } from '@libs/neumorphism-ui/components/Section';
import {
  SelectAndTextInputContainer,
  SelectAndTextInputContainerLabel,
} from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useAlert } from '@libs/neumorphism-ui/components/useAlert';
import { Luna, Rate } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { Msg, MsgExecuteContract } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import { useAccount } from 'contexts/account';
import debounce from 'lodash.debounce';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { pegRecovery } from '../logics/pegRecovery';
import { validateBondAmount } from '../logics/validateBondAmount';
import { ConvertSymbols, ConvertSymbolsContainer } from './ConvertSymbols';

export interface BLunaMintProps {
  className?: string;
}

function Component({ className }: BLunaMintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const { contractAddress, gasPrice, constants } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const estimateFee = useEstimateFee(terraWalletAddress);

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

  const invalidBondAmount = useMemo(
    () => connected && validateBondAmount(bondAmount, bank),
    [bank, bondAmount, connected],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
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

  useEffect(() => {
    if (!connected || !terraWalletAddress || bondAmount.length === 0) {
      setEstimatedGasWanted(null);
      setEstimatedFee(null);
      estimate(null);
      return;
    }

    const amount = floor(big(bondAmount).mul(MICRO));

    if (amount.lt(0) || amount.gt(bank.tokenBalances.uLuna ?? 0)) {
      setEstimatedGasWanted(null);
      setEstimatedFee(null);
      estimate(null);
      return;
    }

    estimate([
      new MsgExecuteContract(
        terraWalletAddress,
        contractAddress.bluna.hub,
        {
          bond: {},
        },
        {
          uluna: amount.toFixed(),
        },
      ),
    ]);
  }, [
    bank.tokenBalances.uLuna,
    bondAmount,
    connected,
    constants.bondGasWanted,
    contractAddress.bluna.hub,
    estimate,
    estimateFee,
    fixedFee,
    gasPrice.uusd,
    terraWalletAddress,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
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
      if (!connected || !terraWalletAddress || !mint) {
        return;
      }

      const estimated = await estimateFee([
        new MsgExecuteContract(
          terraWalletAddress,
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
          exchangeRate: big(1)
            .div(exchangeRate?.exchange_rate ?? '1')
            .toString() as Rate<string>,
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
      connected,
      contractAddress.bluna.hub,
      estimateFee,
      exchangeRate,
      gasPrice.uusd,
      init,
      mint,
      openAlert,
      terraWalletAddress,
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

      <ConvertSymbolsContainer>
        <ConvertSymbols
          className="symbols"
          view="mint"
          fromIcon={<TokenIcon token="luna" />}
          toIcon={<TokenIcon token="bluna" />}
        />
      </ConvertSymbolsContainer>

      {/* Bond (Asset) */}
      <div className="bond-description">
        <p>I want to bond</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="bond"
        gridColumns={[140, '1fr']}
        error={!!invalidBondAmount}
        leftHelperText={invalidBondAmount}
        rightHelperText={
          connected && (
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
                {formatLuna(demicrofy(bank.tokenBalances.uLuna))} Luna
              </span>
            </span>
          )
        }
      >
        <SelectAndTextInputContainerLabel>
          <TokenIcon token="luna" /> Luna
        </SelectAndTextInputContainerLabel>
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
        gridColumns={[140, '1fr']}
        error={!!invalidBondAmount}
      >
        <SelectAndTextInputContainerLabel>
          <TokenIcon token="bluna" /> bLuna
        </SelectAndTextInputContainerLabel>
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
            currencyA="Luna"
            currencyB="bLuna"
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
            !availablePost ||
            !connected ||
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

const StyledComponent = styled(Component)`
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
    img {
      font-size: 12px;
    }
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

export const BLunaMint = fixHMR(StyledComponent);

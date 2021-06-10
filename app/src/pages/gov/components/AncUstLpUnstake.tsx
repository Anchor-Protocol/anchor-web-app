import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatLP,
  formatLPInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { AncUstLP } from '@anchor-protocol/types';
import {
  useAncAncUstLpUnstakeTx,
  useAnchorWebapp,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'base/contexts/bank';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpUnstake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const [unstake, unstakeResult] = useAncAncUstLpUnstakeTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [lpAmount, setLpAmount] = useState<AncUstLP>('' as AncUstLP);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { userLPStakingInfo } = {} } = useRewardsAncUstLpRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidLpAmount = useMemo(() => {
    if (lpAmount.length === 0 || !userLPStakingInfo) return undefined;

    return big(microfy(lpAmount)).gt(userLPStakingInfo.bond_amount)
      ? 'Not enough assets'
      : undefined;
  }, [lpAmount, userLPStakingInfo]);

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
  }, []);

  const proceed = useCallback(
    (lpAmount: AncUstLP) => {
      if (!connectedWallet || !unstake) {
        return;
      }

      unstake({
        lpAmount,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, init, unstake],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    unstakeResult?.status === StreamStatus.IN_PROGRESS ||
    unstakeResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={unstakeResult.value}
        onExit={() => {
          init();

          switch (unstakeResult.status) {
            case StreamStatus.IN_PROGRESS:
              unstakeResult.abort();
              break;
            case StreamStatus.DONE:
              unstakeResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <NumberInput
        className="amount"
        value={lpAmount}
        maxIntegerPoints={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidLpAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setLpAmount(target.value as AncUstLP)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">LP</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidLpAmount}>
        <span>{invalidLpAmount}</span>
        <span>
          Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userLPStakingInfo &&
              setLpAmount(
                formatLPInput(demicrofy(userLPStakingInfo.bond_amount)),
              )
            }
          >
            {userLPStakingInfo
              ? formatLP(demicrofy(userLPStakingInfo.bond_amount))
              : 0}{' '}
            LP
          </span>
        </span>
      </div>

      {lpAmount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !unstake ||
          lpAmount.length === 0 ||
          big(lpAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidLpAmount
        }
        onClick={() => proceed(lpAmount)}
      >
        Unstake
      </ActionButton>
    </>
  );
}

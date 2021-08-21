import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC } from '@anchor-protocol/types';
import {
  useAncGovernanceStakeTx,
  useAnchorWebapp,
  useRewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@packages/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@packages/neumorphism-ui/components/NumberInput';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'contexts/bank';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncGovernanceStake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const [stake, stakeResult] = useAncGovernanceStakeTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setANCAmount] = useState<ANC>('' as ANC);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { userANCBalance } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidANCAmount = useMemo(() => {
    if (ancAmount.length === 0 || !userANCBalance) return undefined;

    return big(microfy(ancAmount)).gt(userANCBalance.balance)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, userANCBalance]);

  const init = useCallback(() => {
    setANCAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    (ancAmount: ANC) => {
      if (!connectedWallet || !stake) {
        return;
      }

      stake({
        ancAmount,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, init, stake],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    stakeResult?.status === StreamStatus.IN_PROGRESS ||
    stakeResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={stakeResult.value}
        onExit={() => {
          init();

          switch (stakeResult.status) {
            case StreamStatus.IN_PROGRESS:
              stakeResult.abort();
              break;
            case StreamStatus.DONE:
              stakeResult.clear();
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
        value={ancAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidANCAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setANCAmount(target.value as ANC)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidANCAmount}>
        <span>{invalidANCAmount}</span>
        <span>
          Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userANCBalance &&
              setANCAmount(formatANCInput(demicrofy(userANCBalance.balance)))
            }
          >
            {userANCBalance ? formatANC(demicrofy(userANCBalance.balance)) : 0}{' '}
            ANC
          </span>
        </span>
      </div>

      {ancAmount.length > 0 && (
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
          !stake ||
          ancAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidANCAmount
        }
        onClick={() => proceed(ancAmount)}
      >
        Stake
      </ActionButton>
    </>
  );
}

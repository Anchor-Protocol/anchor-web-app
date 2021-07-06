import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC, uANC } from '@anchor-protocol/types';
import {
  useAncBalanceQuery,
  useAncGovernanceUnstakeTx,
  useAnchorWebapp,
  useGovStateQuery,
  useRewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { max } from '@terra-dev/big-math';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'contexts/bank';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncGovernanceUnstake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
    contractAddress,
  } = useAnchorWebapp();

  const [unstake, unstakeResult] = useAncGovernanceUnstakeTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setANCAmount] = useState<ANC>('' as ANC);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const { data: { ancBalance: govANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.gov,
  );
  const { data: { govState } = {} } = useGovStateQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const unstakableBalance = useMemo<uANC<Big> | undefined>(() => {
    if (!govANCBalance || !userGovStakingInfo || !govState) return undefined;

    const lockedANC = max(
      0,
      ...userGovStakingInfo.locked_balance.map(([_, { balance }]) => balance),
    );

    const unstakable = big(userGovStakingInfo.balance).minus(
      lockedANC,
    ) as uANC<Big>;

    return unstakable;
  }, [govANCBalance, govState, userGovStakingInfo]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidANCAmount = useMemo(() => {
    if (ancAmount.length === 0 || !unstakableBalance) return undefined;

    return big(microfy(ancAmount)).gt(unstakableBalance)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, unstakableBalance]);

  const init = useCallback(() => {
    setANCAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    async (ancAmount: ANC) => {
      if (!connectedWallet || !unstake) {
        return;
      }

      unstake({
        ancAmount,
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
              unstakableBalance &&
              setANCAmount(formatANCInput(demicrofy(unstakableBalance)))
            }
          >
            {unstakableBalance ? formatANC(demicrofy(unstakableBalance)) : 0}{' '}
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
          !unstake ||
          ancAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidANCAmount
        }
        onClick={() => proceed(ancAmount)}
      >
        Unstake
      </ActionButton>
    </>
  );
}

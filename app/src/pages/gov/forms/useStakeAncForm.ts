import { validateTxFee } from '@anchor-protocol/app-fns';
import { useFormatters } from '@anchor-protocol/formatter';
import { ANC } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { u, UST, MillisTimestamp } from '@libs/types';
import { FormReturn, useForm } from '@libs/use-form';
import Big, { BigSource } from 'big.js';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useMyAncStaked } from 'hooks/gov/useMyAncStaked';
import {
  VotingEscrowConfig,
  useVotingEscrowConfigQuery,
  useMyVotingLockPeriodEndsAtQuery,
} from 'queries';
import { computeEstimatedLockPeriodEndAt } from '../logics/computeEstimatedLockPeriodEndAt';
import { computeLockAmount } from '../logics/computeLockAmount';
import { computeLockPeriod } from '../logics/computeLockPeriod';
import { validateLockPeriod } from '../logics/validateLockPeriod';

interface StakeAncFormInput {
  amount?: number;
  lockPeriod?: number;
}

interface StakeAncFormDependency {
  fixedFee: u<UST>;
  ustBalance: u<UST>;
  connected: boolean;
  availablePost: boolean;
  walletBalance: ANC<string>;
  totalAncStaked: u<ANC<BigSource>>;
  lockConfig: VotingEscrowConfig | undefined;
  lockPeriodEndsAt: MillisTimestamp | undefined;
  lockPeriodEndsAtIsFetched: boolean;
}

interface StakeAncFormStates extends StakeAncFormInput {
  txFee: u<UST>;
  invalidTxFee: string | undefined;
  invalidAmount: string | undefined;
  availablePost: boolean;
  walletBalance: ANC<string>;
  minLockPeriod: number;
  maxLockPeriod: number;
  invalidLockPeriod: string | undefined;
  estimatedLockPeriodEndsAt: MillisTimestamp | undefined;
  requiresLockPeriod: boolean;
  totalAncStaked: u<ANC<BigSource>>;
}

interface StakeAncFormAsyncStates {}

const stakeAncForm = (props: StakeAncFormDependency) => {
  const {
    availablePost,
    connected,
    ustBalance,
    fixedFee,
    walletBalance,
    lockConfig,
    lockPeriodEndsAt,
    lockPeriodEndsAtIsFetched,
    totalAncStaked,
  } = props;

  const minLockPeriod = lockConfig
    ? computeLockAmount(lockConfig, lockConfig.minLockTime)
    : 0;

  const maxLockPeriod = lockConfig
    ? computeLockAmount(lockConfig, lockConfig.maxLockTime)
    : 0;

  const requiresLockPeriod =
    lockPeriodEndsAtIsFetched &&
    lockPeriodEndsAt &&
    lockPeriodEndsAt > Date.now()
      ? false
      : true;

  return ({
    amount,
    lockPeriod,
  }: StakeAncFormInput): FormReturn<
    StakeAncFormStates,
    StakeAncFormAsyncStates
  > => {
    const invalidTxFee =
      connected && amount ? validateTxFee(ustBalance, fixedFee) : undefined;

    const invalidLockPeriod =
      lockPeriod !== undefined
        ? validateLockPeriod(lockPeriod, minLockPeriod, maxLockPeriod)
        : undefined;

    const estimatedLockPeriodEndsAt =
      lockConfig && lockPeriodEndsAt
        ? computeEstimatedLockPeriodEndAt(
            computeLockPeriod(lockConfig, lockPeriod ?? 0),
            lockPeriodEndsAt,
          )
        : undefined;

    const invalidAmount =
      amount && Big(amount).gt(walletBalance) ? 'Not enough assets' : undefined;

    return [
      {
        amount,
        lockPeriod,
        availablePost,
        invalidTxFee,
        invalidAmount,
        invalidLockPeriod,
        estimatedLockPeriodEndsAt,
        minLockPeriod,
        maxLockPeriod,
        requiresLockPeriod,
        txFee: fixedFee,
        walletBalance,
        totalAncStaked,
      },
      undefined,
    ];
  };
};

export const useStakeAncForm = () => {
  const { connected, availablePost } = useAccount();

  const fixedFee = useFixedFee();

  const {
    anc: { demicrofy },
  } = useFormatters();

  const { uUST } = useBalances();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const { uANC } = useBalances();

  const totalAncStaked = useMyAncStaked() ?? (0 as u<ANC<number>>);

  const { data: lockPeriodEndsAt, isFetched: lockPeriodEndsAtIsFetched } =
    useMyVotingLockPeriodEndsAtQuery();

  return useForm(
    stakeAncForm,
    {
      ustBalance: uUST,
      connected,
      availablePost,
      fixedFee,
      walletBalance: demicrofy(uANC),
      lockConfig,
      lockPeriodEndsAt,
      lockPeriodEndsAtIsFetched,
      totalAncStaked,
    },
    () => ({
      lockPeriod:
        lockConfig !== undefined
          ? computeLockAmount(lockConfig, lockConfig.minLockTime)
          : 1,
    }),
  );
};

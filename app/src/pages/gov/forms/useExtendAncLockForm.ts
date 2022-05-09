import { validateTxFee } from '@anchor-protocol/app-fns';
import { ANC, veANC } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { u, UST, MillisTimestamp } from '@libs/types';
import { FormReturn, useForm } from '@libs/use-form';
import { BigSource } from 'big.js';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { millisecondsInSecond } from 'date-fns';
import { useMyAncStaked } from 'hooks/gov/useMyAncStaked';
import {
  VotingEscrowConfig,
  useVotingEscrowConfigQuery,
  useMyVotingPowerQuery,
  useMyVotingLockPeriodEndsAtQuery,
} from 'queries';
import { computeEstimatedLockPeriodEndAt } from '../logics/computeEstimatedLockPeriodEndAt';
import { computeLockAmount } from '../logics/computeLockAmount';
import { computeLockPeriod } from '../logics/computeLockPeriod';
import { validateLockPeriod } from '../logics/validateLockPeriod';

interface ExtendAncLockPeriodFormInput {
  lockPeriod: number | undefined;
}

interface ExtendAncLockPeriodFormDependency {
  fixedFee: u<UST>;
  ustBalance: u<UST>;
  connected: boolean;
  availablePost: boolean;
  totalAncStaked: u<ANC<BigSource>>;
  totalVeAnc: u<veANC<BigSource>>;
  lockConfig: VotingEscrowConfig | undefined;
  lockPeriodEndsAt: MillisTimestamp | undefined;
}

interface ExtendAncLockPeriodFormStates extends ExtendAncLockPeriodFormInput {
  txFee: u<UST>;
  invalidTxFee: string | undefined;
  invalidLockPeriod: string | undefined;
  minLockPeriod: number;
  maxLockPeriod: number;
  availablePost: boolean;
  estimatedLockPeriodEndsAt: MillisTimestamp | undefined;
  totalAncStaked: u<ANC<BigSource>>;
}

interface ExtendAncLockPeriodFormAsyncStates {}

const extendAncLockPeriodForm = (props: ExtendAncLockPeriodFormDependency) => {
  const {
    availablePost,
    connected,
    ustBalance,
    fixedFee,
    totalAncStaked,
    lockConfig,
    lockPeriodEndsAt,
  } = props;

  const minLockPeriod = lockConfig
    ? computeLockAmount(lockConfig, lockConfig.minLockTime)
    : 0;

  const maxLockPeriod = lockConfig
    ? computeLockAmount(lockConfig, lockConfig.maxLockTime)
    : 0;

  const now = Date.now();

  const period =
    lockConfig && lockPeriodEndsAt && lockPeriodEndsAt > now
      ? Math.ceil(
          (lockPeriodEndsAt - now) /
            millisecondsInSecond /
            lockConfig.periodDuration,
        )
      : 0;

  return ({
    lockPeriod,
  }: ExtendAncLockPeriodFormInput): FormReturn<
    ExtendAncLockPeriodFormStates,
    ExtendAncLockPeriodFormAsyncStates
  > => {
    const invalidTxFee = connected
      ? validateTxFee(ustBalance, fixedFee)
      : undefined;

    const invalidLockPeriod =
      lockPeriod !== undefined
        ? validateLockPeriod(lockPeriod, minLockPeriod, maxLockPeriod - period)
        : undefined;

    const estimatedLockPeriodEndsAt = lockConfig
      ? computeEstimatedLockPeriodEndAt(
          computeLockPeriod(lockConfig, lockPeriod ?? 0),
          lockPeriodEndsAt ?? (Date.now() as MillisTimestamp),
        )
      : undefined;

    return [
      {
        availablePost,
        invalidTxFee,
        lockPeriod,
        invalidLockPeriod,
        minLockPeriod,
        maxLockPeriod,
        txFee: fixedFee,
        estimatedLockPeriodEndsAt,
        totalAncStaked,
      },
      undefined,
    ];
  };
};

export const useExtendAncLockForm = () => {
  const { connected, availablePost } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST } = useBalances();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const totalAncStaked = useMyAncStaked() ?? (0 as u<ANC<number>>);

  const { data: totalVeAnc = 0 as u<veANC<number>> } = useMyVotingPowerQuery();

  const { data: lockPeriodEndsAt } = useMyVotingLockPeriodEndsAtQuery();

  return useForm(
    extendAncLockPeriodForm,
    {
      ustBalance: uUST,
      connected,
      availablePost,
      fixedFee,
      totalAncStaked,
      totalVeAnc,
      lockConfig,
      lockPeriodEndsAt,
    },
    () => ({
      lockPeriod:
        lockConfig !== undefined
          ? computeLockAmount(lockConfig, lockConfig.minLockTime)
          : undefined,
    }),
  );
};

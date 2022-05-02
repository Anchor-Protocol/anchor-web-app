import { formatVeAnc } from '@anchor-protocol/notation';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { ANC } from '@anchor-protocol/types';
import { Second } from '@libs/types';
import { TxFeeListItem } from 'components/TxFeeList';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import React from 'react';
import { computeEstimatedVeAnc } from '../logics/computeEstimatedVeAnc';
import { SwishSpinner } from 'react-spinners-kit';
import { useGovStateQuery } from 'queries';
import { demicrofy } from '@libs/formatter';
import Big from 'big.js';
import { useAncTokenomics } from 'hooks';

interface EstimatedVeAncAmountProps {
  period?: Second;
  amount?: ANC;
}

export const EstimatedVeAncAmount = ({
  period,
  amount,
}: EstimatedVeAncAmountProps) => {
  const { data: lockConfig } = useVotingEscrowConfigQuery();
  const { data: govState } = useGovStateQuery();
  const ancTokenomics = useAncTokenomics();

  const renderVeAncAmount = () => {
    if (!period || !amount) {
      return `-`;
    }

    if (!lockConfig || !govState || !ancTokenomics) {
      return <SwishSpinner size={12} />;
    }

    const totalShare = demicrofy(govState.total_share);
    const totalStaked = demicrofy(ancTokenomics.totalStaked);

    const sAncAmount = Big(amount).mul(totalShare).div(totalStaked);

    const estimatedVeAnc = computeEstimatedVeAnc(
      lockConfig.boostCoefficient,
      period,
      lockConfig.maxLockTime,
      sAncAmount.toString() as ANC,
    );

    return `${formatVeAnc(estimatedVeAnc)} ${VEANC_SYMBOL}`;
  };

  return (
    <TxFeeListItem label={`Receive ${VEANC_SYMBOL}`}>
      {renderVeAncAmount()}
    </TxFeeListItem>
  );
};

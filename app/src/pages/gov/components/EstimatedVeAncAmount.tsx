import { formatVeAnc } from '@anchor-protocol/notation';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { ANC } from '@anchor-protocol/types';
import { Second } from '@libs/types';
import { TxFeeListItem } from 'components/TxFeeList';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import React from 'react';
import { computeEstimatedVeAnc } from '../logics/computeEstimatedVeAnc';
import { SwishSpinner } from 'react-spinners-kit';
import { useSAnc } from '../hooks/useSAnc';

interface EstimatedVeAncAmountProps {
  period?: Second;
  amount?: ANC;
}

export const EstimatedVeAncAmount = ({
  period,
  amount,
}: EstimatedVeAncAmountProps) => {
  const { convertAncToSAnc } = useSAnc();
  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const renderVeAncAmount = () => {
    if (!period || !amount) {
      return `-`;
    }

    if (!convertAncToSAnc || !lockConfig) {
      return <SwishSpinner size={12} />;
    }

    const estimatedVeAnc = computeEstimatedVeAnc(
      lockConfig.boostCoefficient,
      period,
      lockConfig.maxLockTime,
      convertAncToSAnc(amount),
    );

    return `${formatVeAnc(estimatedVeAnc)} ${VEANC_SYMBOL}`;
  };

  return (
    <TxFeeListItem label={`Receive ${VEANC_SYMBOL}`}>
      {renderVeAncAmount()}
    </TxFeeListItem>
  );
};

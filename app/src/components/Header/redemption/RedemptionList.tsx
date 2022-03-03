import React from 'react';
import { UIElementProps } from '@libs/ui';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from '../shared';
import styled from 'styled-components';
import { useRedemptions } from 'tx/evm/storage/useRedemptions';
import { useNavigate } from 'react-router-dom';
import { formatDistance, fromUnixTime } from 'date-fns';

interface RedemptionListProps extends UIElementProps {
  onClose: () => void;
}

function RedemptionListBase(props: RedemptionListProps) {
  const { className, onClose } = props;
  const { redemptions } = useRedemptions();
  const navigate = useNavigate();

  return (
    <ButtonList className={className} title="Redeemable transactions">
      {redemptions.map((redemption) => (
        <div className="redemption" key={redemption.outgoingSequence}>
          <div className="details">
            <span className="action">
              {redemption.display?.action ?? 'Unknown'} #
              {redemption.outgoingSequence}
            </span>
            <FlatButton
              className="button redeem"
              onClick={() => {
                onClose();
                navigate(`/bridge/redeem/${redemption.outgoingSequence}`);
              }}
            >
              Redeem
            </FlatButton>
          </div>

          <div className="more-details">
            <div className="amount">
              {redemption.display?.amount ?? 'Unknown'}
            </div>
            <div className="timestamp">
              {formatDistance(
                fromUnixTime(redemption.tokenTransferVAA.timestamp),
                new Date(),
                { addSuffix: true },
              )}
            </div>
          </div>
          <div className="divider" />
        </div>
      ))}
    </ButtonList>
  );
}

export const RedemptionList = styled(RedemptionListBase)`
  padding: 20px 10px;

  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }

  .redemption {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 500;
    font-size: 8px;
    margin: 5px 10px;

    .action {
      font-size: 10px;
      width: auto;
      height: 20px;
      line-height: 20px;
    }

    .redeem {
      height: 20px;
      margin: 0;
      margin-left: auto;
      width: 60px;
      font-size: 8px;
    }

    .details {
      display: flex;
      width: 100%;
      margin-bottom: 2px;
    }

    .more-details {
      width: 100%;
      color: gray;
      display: flex;
    }

    .timestamp {
      margin-left: auto;
    }

    .divider {
      margin-top: 4px;
      width: 100%;
      border-bottom: 1px dashed
        ${({ theme }) =>
          theme.palette.type === 'light'
            ? '#e5e5e5'
            : 'rgba(255, 255, 255, 0.1)'};
    }
  }
`;

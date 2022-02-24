/* tslint:disable */
/* eslint-disable */

import React, { Fragment, useEffect, useState } from 'react';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { Snackbar } from '@libs/snackbar';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { RedemptionPayload } from '@anchor-protocol/crossanchor-sdk';
import { useNavigate } from 'react-router-dom';

export const RedemptionSnackbar = (props: { redemption: number }) => {
  const [loading, setLoading] = useState(true);

  const redemptionPayload = {
    amount: 5000,
    originAddress: 'depositStable',
    originChain: 'originChain',
    targetAddress: 'depositStable',
    targetChain: 'targetChain',
    timestamp: formatDistance(
      new Date('2022-02-04T15:39:40.000Z'),
      new Date(),
      { addSuffix: true },
    ),
    vaa: 'vaa',
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <Snackbar autoClose={false}>
      {loading ? (
        <Fragment />
      ) : (
        <SnackbarContent
          message={
            <RedemptionDetails
              redemptionPayload={redemptionPayload as any}
              redemptionSequence={props.redemption}
            />
          }
        />
      )}
    </Snackbar>
  );
};

const RedemptionDetailsComponent = (props: {
  className?: string;
  redemptionSequence: number;
  redemptionPayload: RedemptionPayload;
}) => {
  const navigate = useNavigate();

  return (
    <div className={props.className}>
      <div>
        Redeem cross-chain token transfer (
        {props.redemptionPayload.originAddress})
      </div>
      <div className="details">
        <div>{props.redemptionPayload.amount} UST</div>
        <div className="timestamp">{props.redemptionPayload.timestamp}</div>
        <ActionButton
          className="redeem"
          onClick={() => navigate(`/bridge/redeem/${props.redemptionSequence}`)}
        >
          Redeem
        </ActionButton>
      </div>
    </div>
  );
};

const RedemptionDetails = styled(RedemptionDetailsComponent)`
  display: flex;
  flex-direction: column;

  .details {
    display: flex;
    align-items: center;
    color: gray;
    font-weight: 500;
    font-size: 10px;
  }

  .redeem {
    font-size: 10px;
    width: 60px;
    height: 20px;
    margin-left: auto;
    margin-top: 4px;
  }

  .timestamp {
    margin-left: 10px;
  }
`;

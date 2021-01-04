import { fabricatebAssetClaim } from '@anchor-protocol/anchor-js/fabricators';
import { fabricatebAssetUpdateGlobalIndex } from '@anchor-protocol/anchor-js/fabricators/basset/basset-update-global-index';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import Amount from '../../components/amount';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ActionContainer } from '../../containers/action';
import useBassetClaimable from '../../hooks/mantle/use-basset-claimable';
import { useWallet } from '../../hooks/use-wallet';
import { useAddressProvider } from '../../providers/address-provider';

import style from './basset.module.scss';

export interface ClaimProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const bondItems: Item[] = [
  { label: 'Luna', value: 'luna' },
  { label: 'KRT', value: 'krt' },
  { label: 'UST', value: 'ust' },
];

function ClaimBase({ className }: ClaimProps) {
  const { address } = useWallet();
  const addressProvider = useAddressProvider();
  //const [withdrawState, setWithdrawState] = useState({ amount: '0.00' });

  const [
    //loading,
    //error,
    claimable = '0',
  ] = useBassetClaimable();

  //const isReady = !loading && !error;

  // ---------------------------------------------
  //
  // ---------------------------------------------
  const [bond, setBond] = useState<Item>(() => bondItems[0]);

  const [history, setHistory] = useState<ReactNode>(() => null);

  const updateHistory = useCallback(() => {
    setHistory(
      Math.random() > 0.5 ? (
        <li>
          <p>
            Requested time: <time>09:27, 2 Oct 2020</time>
          </p>
          <p>101 bLuna</p>
          <p>
            Claimable time: <time>09:27, 2 Oct 2020</time>
          </p>
          <p>101 Luna</p>
        </li>
      ) : (
        Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => (
          <li key={'history' + i}>
            <p>
              Requested time: <time>09:27, 2 Oct 2020</time>
            </p>
            <p>101 bLuna</p>
            <p>
              Claimable time: <time>09:27, 2 Oct 2020</time>
            </p>
            <p>101 Luna</p>
          </li>
        ))
      ),
    );
  }, []);

  useEffect(() => {
    updateHistory();
  }, [updateHistory]);

  return (
    <div className={className}>
      <Section>
        <NativeSelect
          className="bond"
          value={bond.value}
          onChange={({ target }) =>
            setBond(
              bondItems.find(({ value }) => target.value === value) ??
                bondItems[0],
            )
          }
        >
          {bondItems.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>

        <article className="withdrawable-amount">
          <h4>Withdrawable Amount</h4>
          <p>48,000.00 Luna</p>
        </article>

        <ActionButton className="submit" onClick={updateHistory}>
          Withdraw
        </ActionButton>

        <ul className="withdraw-history">{history}</ul>
      </Section>

      <Section>
        <article className="claimable-rewards">
          <h4>Claimable Rewards</h4>
          <p>3,000.00 UST</p>
        </article>

        <ActionButton className="submit">Claim</ActionButton>
      </Section>

      <HorizontalHeavyRuler />

      <Section>
        <article className={style.business}>
          <Box>
            <header>Available Luna</header>
            <div>
              <Amount amount={+claimable} denom="Luna" />
            </div>
            <footer>
              <ActionContainer
                render={(execute) => (
                  <Button
                    type={ButtonTypes.PRIMARY}
                    transactional={true}
                    onClick={() => alert('oops')}
                  >
                    Withdraw
                  </Button>
                )}
              />
            </footer>
          </Box>
          <Box>
            <header>Claimable Rewards</header>
            <div>
              <Amount amount={+claimable} denom="UST" />
            </div>
            <footer>
              <ActionContainer
                render={(execute) => (
                  <Button
                    type={ButtonTypes.PRIMARY}
                    onClick={() =>
                      execute(
                        fabricatebAssetClaim({
                          address,
                          recipient: address,
                          bAsset: addressProvider.bAssetToken('uluna'),
                        }),
                      )
                    }
                    transactional={true}
                  >
                    Claim
                  </Button>
                )}
              />
            </footer>
          </Box>
        </article>

        {/* owner operations */}
        <div>
          <ActionContainer
            render={(execute) => (
              <Button
                type={ButtonTypes.DEFAULT}
                transactional={true}
                onClick={() =>
                  execute(
                    fabricatebAssetUpdateGlobalIndex({
                      address,
                      bAsset: 'bluna',
                    }),
                  )
                }
              >
                Update Global Index
              </Button>
            )}
          />
        </div>
      </Section>
    </div>
  );
}

export const Claim = styled(ClaimBase)`
  > section {
    margin-bottom: 40px;
  }

  .bond {
    width: 100%;
    margin-bottom: 60px;
  }

  .withdrawable-amount,
  .claimable-rewards {
    text-align: center;

    h4 {
      font-size: 14px;
      font-weight: 300;
      color: ${({ theme }) => theme.dimTextColor};
      margin-bottom: 5px;
    }

    p {
      font-size: 48px;
      font-weight: 300;
      color: ${({ theme }) => theme.textColor};
    }

    margin-bottom: 30px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }

  .withdraw-history {
    margin-top: 40px;

    max-height: 185px;
    overflow-y: auto;

    list-style: none;
    padding: 20px;

    border-radius: 5px;

    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};

    li {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      justify-content: space-between;
      align-items: center;
      grid-gap: 5px;

      font-size: 12px;

      > :nth-child(odd) {
        color: ${({ theme }) => theme.dimTextColor};
      }

      > :nth-child(even) {
        text-align: right;
        color: ${({ theme }) => theme.textColor};
      }

      &:not(:last-child) {
        padding-bottom: 10px;

        border-bottom: 1px solid
          ${({ theme }) =>
            rulerShadowColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }

      &:not(:first-child) {
        padding-top: 10px;

        border-top: 1px solid
          ${({ theme }) =>
            rulerLightColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }
    }
  }
`;

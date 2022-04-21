import { TokenIcon } from '@anchor-protocol/token-icons';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { useCollateralGaugesQuery } from 'queries/gov/useCollateralGaugesQuery';
import React from 'react';
import styled from 'styled-components';
import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';

export const CollateralList = () => {
  const { data: { collateral } = { collateral: [] } } =
    useCollateralGaugesQuery();

  return (
    <Container>
      <HorizontalScrollTable minWidth={850}>
        <colgroup>
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 250 }} />
        </colgroup>
        <thead>
          <tr>
            <th>COLLATERAL LIST</th>
            <th>Total votes</th>
            <th>Voted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collateral.map(({ symbol, icon, name, votes, share }) => (
            <tr key={symbol}>
              <td>
                <i>
                  <TokenIcon symbol={symbol} path={icon} />
                </i>
                <div>
                  <div className="coin">{symbol}</div>
                  <p className="name">{name}</p>
                </div>
              </td>
              <td>
                <div className="value">
                  {formatUTokenIntegerWithoutPostfixUnits(votes)} veANC
                </div>
                <p className="volatility">{(share * 100).toFixed(2)}%</p>
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>
    </Container>
  );
};

const Container = styled(Section)`
  // copied from app/src/pages/borrow
  table {
    thead {
      th {
        text-align: right;

        &:first-child {
          font-size: 12px;
          font-weight: 500;
          color: ${({ theme }) => theme.textColor};
          text-align: left;
        }
      }
    }

    tbody {
      td {
        text-align: right;

        .value,
        .coin {
          font-size: 16px;
        }

        .volatility,
        .name {
          font-size: 12px;
          color: ${({ theme }) => theme.dimTextColor};
        }

        &:first-child {
          text-align: left;

          display: flex;

          align-items: center;

          i {
            width: 60px;
            height: 60px;

            margin-right: 15px;

            svg,
            img {
              display: block;
              width: 60px;
              height: 60px;
            }
          }

          .coin {
            font-weight: bold;

            grid-column: 2;
            grid-row: 1/2;
          }

          .name {
            grid-column: 2;
            grid-row: 2;
          }
        }

        &:last-child {
          button {
            height: 32px;
            font-size: 12px;
            font-weight: 500;

            padding: 0 24px;

            &:not(:last-child) {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
`;

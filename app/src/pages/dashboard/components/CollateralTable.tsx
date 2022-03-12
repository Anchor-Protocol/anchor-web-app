import {
  MarketCollateralsData,
  WhitelistCollateral,
} from '@anchor-protocol/app-fns';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  formatBAssetWithPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { bAsset } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { u, UST } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import Big from 'big.js';
import { UIElementProps } from 'components/layouts/UIElementProps';
import React from 'react';

interface CollateralTableProps extends UIElementProps {
  whitelistCollateral: WhitelistCollateral[];
  collateralData: MarketCollateralsData | undefined;
}

export const CollateralTable = (props: CollateralTableProps) => {
  const { className, whitelistCollateral, collateralData } = props;

  return (
    <HorizontalScrollTable minWidth={800} className={className}>
      <colgroup>
        <col style={{ width: 300 }} />
        <col style={{ width: 300 }} />
        <col style={{ width: 300 }} />
        <col style={{ width: 300 }} />
      </colgroup>
      <thead>
        <tr>
          <th>COLLATERAL MARKET</th>
          <th>
            <IconSpan>
              Price <InfoTooltip>Oracle price of collateral</InfoTooltip>
            </IconSpan>
          </th>
          <th>
            <IconSpan>
              Total Collateral <InfoTooltip>Total collateral value</InfoTooltip>
            </IconSpan>
          </th>
          <th>
            <IconSpan>
              Total Collateral Value{' '}
              <InfoTooltip>Total collateral value in USD</InfoTooltip>
            </IconSpan>
          </th>
        </tr>
      </thead>
      <tbody>
        {whitelistCollateral.map((collateral) => {
          const data = collateralData?.now.collaterals.find(
            (c) => c.symbol === collateral.symbol,
          );

          return (
            <tr key={collateral.symbol}>
              <td>
                <div>
                  <i>
                    <TokenIcon
                      symbol={collateral.symbol}
                      path={collateral.icon}
                    />
                  </i>
                  <div>
                    <div className="coin">{collateral.symbol}</div>
                    <p className="name">{collateral.name}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="value">
                  ${' '}
                  <AnimateNumber format={formatUST}>
                    {data ? data.price : (0 as UST<number>)}
                  </AnimateNumber>
                </div>
              </td>
              <td>
                <div className="value">
                  <AnimateNumber format={formatBAssetWithPostfixUnits}>
                    {data?.collateral
                      ? demicrofy(data?.collateral)
                      : (0 as bAsset<number>)}
                  </AnimateNumber>
                </div>
              </td>
              <td>
                <div className="value">
                  ${' '}
                  <AnimateNumber
                    format={formatUSTWithPostfixUnits}
                    id="collateral-value"
                  >
                    {data?.collateral
                      ? demicrofy(
                          Big(data.collateral)
                            .mul(data.price)
                            .toString() as u<UST>,
                        )
                      : (0 as UST<number>)}
                  </AnimateNumber>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </HorizontalScrollTable>
  );
};

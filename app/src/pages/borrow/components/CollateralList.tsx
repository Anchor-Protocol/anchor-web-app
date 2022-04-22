import { computeLiquidationPrice } from '@anchor-protocol/app-fns';
import {
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import {
  useFormatters,
  formatOutput,
  demicrofy,
} from '@anchor-protocol/formatter';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { bAsset, u, UST } from '@anchor-protocol/types';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { UIElementProps } from '@libs/ui';
import { Launch } from '@material-ui/icons';
import big, { Big, BigSource } from 'big.js';
import { BuyLink } from 'components/BuyButton';
import { useAccount } from 'contexts/account';
import { useWhitelistCollateralQuery, WhitelistCollateral } from 'queries';
import React, { useMemo } from 'react';
import { microfyPrice } from 'utils/microfyPrice';
import { useProvideCollateralDialog } from './useProvideCollateralDialog';
import { useRedeemCollateralDialog } from './useRedeemCollateralDialog';

const renderBuyLink = (collateral: WhitelistCollateral) => {
  // TODO: think of a sustainable way to do this
  const href =
    collateral.symbol === 'bETH'
      ? 'https://anchor.lido.fi/'
      : collateral.symbol === 'bATOM'
      ? 'https://app.pstake.finance/anchor'
      : null;

  return (
    href && (
      <BuyLink
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{ transform: 'translateY(-5px)' }}
      >
        GET <Launch />
      </BuyLink>
    )
  );
};

interface CollateralInfo {
  collateral: WhitelistCollateral;
  price: UST;
  liquidationPrice: UST | undefined;
  lockedAmount: u<bAsset>;
  lockedAmountInUST: u<UST<BigSource>>;
}

export function CollateralList(props: UIElementProps) {
  const { className } = props;

  const { connected } = useAccount();

  const { data: borrowMarket } = useBorrowMarketQuery();

  const { data: borrowBorrower } = useBorrowBorrowerQuery();

  const [openProvideCollateralDialog, provideCollateralDialogElement] =
    useProvideCollateralDialog();

  const [openRedeemCollateralDialog, redeemCollateralDialogElement] =
    useRedeemCollateralDialog();

  const { data: whitelist } = useWhitelistCollateralQuery();

  const {
    ust: { formatOutput: formatUSTOutput, demicrofy: demicrofyUST },
  } = useFormatters();

  const collaterals = useMemo<CollateralInfo[]>(() => {
    if (!borrowMarket || !whitelist) {
      return [];
    }

    return whitelist
      .filter((collateral) => collateral.bridgedAddress !== undefined)
      .map((collateral) => {
        const oracle = borrowMarket.oraclePrices.prices.find(
          ({ asset }) => collateral.collateral_token === asset,
        );
        const collateralAmount =
          borrowBorrower?.overseerCollaterals.collaterals.find(
            ([collateralToken]) =>
              collateral.collateral_token === collateralToken,
          );

        return {
          collateral,
          price: microfyPrice(oracle?.price, collateral.decimals),
          liquidationPrice:
            borrowBorrower &&
            borrowBorrower.overseerCollaterals.collaterals.length === 1 &&
            collateral
              ? microfyPrice(
                  computeLiquidationPrice(
                    collateral.collateral_token,
                    borrowBorrower.marketBorrowerInfo,
                    borrowBorrower.overseerBorrowLimit,
                    borrowBorrower.overseerCollaterals,
                    borrowMarket.overseerWhitelist,
                    borrowMarket.oraclePrices,
                  ),
                  collateral.decimals,
                )
              : undefined,
          lockedAmount: collateralAmount?.[1] ?? ('0' as u<bAsset>),
          lockedAmountInUST: big(collateralAmount?.[1] ?? 0).mul(
            oracle?.price ?? 1,
          ) as u<UST<Big>>,
        };
      })
      .sort((a, b) =>
        big(a.lockedAmountInUST).gte(big(b.lockedAmountInUST)) ? -1 : 1,
      )
      .filter((collateral) => Number(collateral.price) !== 0);
  }, [borrowBorrower, borrowMarket, whitelist]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
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
            <th>
              <IconSpan>
                Price{' '}
                <InfoTooltip>
                  Current price of bAsset / Price of bAsset that will trigger
                  liquidation of current loan
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>
              <IconSpan>
                Provided{' '}
                <InfoTooltip>
                  Value of bAsset collateral deposited by user / Amount of
                  bAsset collateral deposited by user
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collaterals.map(
            ({
              collateral,
              price,
              liquidationPrice,
              lockedAmount,
              lockedAmountInUST,
            }) => (
              <tr key={collateral.collateral_token}>
                <td>
                  <i>
                    <TokenIcon
                      symbol={collateral.symbol}
                      path={collateral.icon}
                    />
                  </i>
                  <div>
                    <div className="coin">
                      {collateral.symbol} {renderBuyLink(collateral)}
                    </div>
                    <p className="name">{collateral.name}</p>
                  </div>
                </td>
                <td>
                  <div className="value">{formatUSTOutput(price)} UST</div>
                  <p className="volatility">
                    {Boolean(Number(liquidationPrice)) &&
                      formatUSTOutput(liquidationPrice!) + ' UST'}
                  </p>
                </td>
                <td>
                  <div className="value">
                    {formatOutput(
                      demicrofy(lockedAmount, collateral.decimals),
                      {
                        decimals: collateral.decimals,
                      },
                    )}{' '}
                    {collateral.symbol}
                  </div>
                  <p className="volatility">
                    {formatUSTOutput(demicrofyUST(lockedAmountInUST))} UST
                  </p>
                </td>
                <td>
                  <BorderButton
                    disabled={!connected || !borrowMarket}
                    onClick={() =>
                      borrowMarket &&
                      borrowBorrower &&
                      openProvideCollateralDialog({
                        collateral,
                        fallbackBorrowMarket: borrowMarket,
                        fallbackBorrowBorrower: borrowBorrower,
                      })
                    }
                  >
                    Provide
                  </BorderButton>
                  <BorderButton
                    disabled={
                      !connected ||
                      !borrowMarket ||
                      !borrowBorrower ||
                      big(lockedAmount).lte(0)
                    }
                    onClick={() =>
                      borrowMarket &&
                      borrowBorrower &&
                      openRedeemCollateralDialog({
                        collateral,
                        fallbackBorrowMarket: borrowMarket,
                        fallbackBorrowBorrower: borrowBorrower,
                      })
                    }
                  >
                    Withdraw
                  </BorderButton>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </HorizontalScrollTable>

      {provideCollateralDialogElement}
      {redeemCollateralDialogElement}
    </Section>
  );
}

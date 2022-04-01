import { ExecuteMsg } from '@anchor-protocol/app-fns';
import { anchorToken, Rate } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useWhitelistCollateralQuery,
} from '@anchor-protocol/app-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export function PollCreateModifyCollateralAttribute() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { contractAddress: address } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const { data: whitelistCollateral = [] } = useWhitelistCollateralQuery();
  const [collateralSymbol, setCollateralSymbol] = useState<string>();

  useEffect(() => {
    if (!collateralSymbol && whitelistCollateral.length > 0) {
      setCollateralSymbol(whitelistCollateral[0].symbol);
    }
  }, [collateralSymbol, whitelistCollateral]);

  const [ltv, setLtv] = useState<string>('');

  const invalidLtv = useMemo(() => {
    if (ltv.length === 0) return undefined;
    return big(ltv).lt(1) ? 'Please input LTV between 1 ~ 99' : undefined;
  }, [ltv]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback((): ExecuteMsg[] | undefined => {
    const collateral = whitelistCollateral.find(
      ({ symbol }) => symbol === collateralSymbol,
    );
    if (!collateral) return;

    const msg: anchorToken.gov.PollMsg = {
      update_whitelist: {
        collateral_token: collateral.collateral_token,
        max_ltv: formatExecuteMsgNumber(big(ltv).div(100)) as Rate,
      },
    };

    return [
      {
        order: 1,
        contract: address.moneyMarket.overseer,
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
        //msg: btoa(JSON.stringify(msg)),
      },
    ];
  }, [
    address.moneyMarket.overseer,
    collateralSymbol,
    ltv,
    whitelistCollateral,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify Collateral Attribute"
      submitDisabled={ltv.length === 0 || !!invalidLtv || !collateralSymbol}
      onCreateMsgs={createMsgs}
    >
      <div className="description">
        <p>Collateral</p>
        <p />
      </div>

      <NativeSelect
        className="bAsset"
        style={{ width: '100%' }}
        data-selected-value={collateralSymbol}
        value={collateralSymbol}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setCollateralSymbol(target.value)
        }
      >
        {whitelistCollateral.map(({ symbol }) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </NativeSelect>

      <div className="description">
        <p>
          <IconSpan>
            Max LTV{' '}
            <InfoTooltip>
              Maximum loan to value ratio allowed for collateral
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="MAX LTV"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={ltv}
        error={!!invalidLtv}
        helperText={invalidLtv}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setLtv(target.value)
        }
      />
    </PollCreateBase>
  );
}

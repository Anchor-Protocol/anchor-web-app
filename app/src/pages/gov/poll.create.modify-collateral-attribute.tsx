import { ExecuteMsg } from '@anchor-protocol/app-fns';
import { anchorToken, CW20Addr, Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

interface Item {
  label: string;
  value: CW20Addr;
}

export function PollCreateModifyCollateralAttribute() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { contractAddress: address } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const bAssetItems = useMemo<Item[]>(() => {
    return [{ label: 'bLUNA', value: address.cw20.bLuna }];
  }, [address.cw20.bLuna]);

  const [bAsset, setBAsset] = useState<Item>(() => bAssetItems[0]);

  const [ltv, setLtv] = useState<string>('');

  const invalidLtv = useMemo(() => {
    if (ltv.length === 0) return undefined;
    return big(ltv).lt(1) ? 'Please input LTV between 1 ~ 99' : undefined;
  }, [ltv]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (bAsset: Item, ltv: string): ExecuteMsg[] => {
      const msg: anchorToken.gov.PollMsg = {
        update_whitelist: {
          collateral_token: bAsset.value,
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
    },
    [address.moneyMarket.overseer],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify Collateral Attribute"
      submitDisabled={ltv.length === 0 || !!invalidLtv}
      onCreateMsgs={() => createMsgs(bAsset, ltv)}
    >
      <div className="description">
        <p>Collateral bAsset</p>
        <p />
      </div>

      <NativeSelect
        className="bAsset"
        style={{ width: '100%' }}
        data-selected-value={bAsset.value}
        value={bAsset.value}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setBAsset(
            bAssetItems?.find(({ value }) => target.value === value) ??
              bAssetItems[0],
          )
        }
      >
        {bAssetItems.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
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

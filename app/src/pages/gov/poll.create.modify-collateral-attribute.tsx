import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  formatFluidDecimalPoints,
  MAX_EXECUTE_MSG_DECIMALS,
} from '@anchor-protocol/notation';
import { CW20Addr, Rate } from '@anchor-protocol/types';
import { PollMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { useContractAddress } from 'contexts/contract';
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
  const address = useContractAddress();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const bAssetItems = useMemo<Item[]>(() => {
    return [{ label: 'bLuna', value: address.cw20.bLuna }];
  }, [address.cw20.bLuna]);

  const [bAsset, setBAsset] = useState<Item>(() => bAssetItems[0]);

  const [ltv, setLtv] = useState<string>('');

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (bAsset: Item, ltv: string): ExecuteMsg[] => {
      const msg: PollMsg = {
        update_whitelist: {
          collateral_token: bAsset.value,
          max_ltv: formatFluidDecimalPoints(
            big(ltv).div(100),
            MAX_EXECUTE_MSG_DECIMALS,
          ) as Rate,
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
      submitDisabled={ltv.length === 0}
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
        <p>Max LTV</p>
        <p />
      </div>

      <NumberInput
        placeholder="MAX LTV"
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={ltv}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setLtv(target.value)
        }
      />
    </PollCreateBase>
  );
}

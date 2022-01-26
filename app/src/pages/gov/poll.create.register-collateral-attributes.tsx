import { ExecuteMsg } from '@anchor-protocol/app-fns';
import { CW20Addr, HumanAddr, moneyMarket, Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { InputAdornment } from '@material-ui/core';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { AccAddress } from '@terra-money/terra.js';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateRegisterCollateralAttributes() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { contractAddress: address } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [collateralName, setCollateralName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [tokenContractAddress, setTokenContractAddress] = useState<string>('');
  const [priceFeeder, setPriceFeeder] = useState<string>('');
  const [maxLtv, setMaxLtv] = useState<string>('');
  const [custodyContractAddress, setCustodyContractAddress] =
    useState<string>('');

  const invalidTokenContractAddress = useMemo(() => {
    return tokenContractAddress.length > 0 &&
      !AccAddress.validate(tokenContractAddress)
      ? 'Invalid address'
      : undefined;
  }, [tokenContractAddress]);

  const invalidPriceFeeder = useMemo(() => {
    return priceFeeder.length > 0 && !AccAddress.validate(priceFeeder)
      ? 'Invalid address'
      : undefined;
  }, [priceFeeder]);

  const invalidCustodyContractAddress = useMemo(() => {
    return custodyContractAddress.length > 0 &&
      !AccAddress.validate(custodyContractAddress)
      ? 'Invalid address'
      : undefined;
  }, [custodyContractAddress]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (
      collateralName: string,
      symbol: string,
      tokenContractAddress: string,
      priceFeeder: string,
      maxLtv: string,
      custodyContractAddress: string,
    ): ExecuteMsg[] => {
      const registerWhitelist: moneyMarket.overseer.RegisterWhitelist['whitelist'] =
        {
          name: collateralName,
          symbol,
          collateral_token: tokenContractAddress as CW20Addr,
          custody_contract: custodyContractAddress as HumanAddr,
          max_ltv: big(maxLtv).div(100).toFixed() as Rate,
        };

      const registerFeeder: moneyMarket.oracle.RegisterFeeder['register_feeder'] =
        {
          asset: tokenContractAddress as CW20Addr,
          feeder: priceFeeder as HumanAddr,
        };

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (
        Object.keys(registerWhitelist).length > 0 &&
        Object.keys(registerFeeder).length > 0
      ) {
        msgs.push(
          {
            contract: address.moneyMarket.oracle,
            msg: Buffer.from(
              JSON.stringify({
                register_feeder: registerFeeder,
              }),
            ).toString('base64'),
          },
          {
            contract: address.moneyMarket.overseer,
            msg: Buffer.from(
              JSON.stringify({
                whitelist: registerWhitelist,
              }),
            ).toString('base64'),
          },
        );
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.moneyMarket.oracle, address.moneyMarket.overseer],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Register Collateral Attributes"
      submitDisabled={
        collateralName.length === 0 ||
        symbol.length === 0 ||
        tokenContractAddress.length === 0 ||
        priceFeeder.length === 0 ||
        maxLtv.length === 0 ||
        custodyContractAddress.length === 0 ||
        !!invalidTokenContractAddress ||
        !!invalidPriceFeeder ||
        !!invalidCustodyContractAddress
      }
      onCreateMsgs={() =>
        createMsgs(
          collateralName,
          symbol,
          tokenContractAddress,
          priceFeeder,
          maxLtv,
          custodyContractAddress,
        )
      }
    >
      <div className="description">
        <p>
          <IconSpan>
            Collateral Name{' '}
            <InfoTooltip>
              Name of bAsset to be registered as collateral
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        value={collateralName}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setCollateralName(target.value)
        }
      />

      <div className="description">
        <p>
          <IconSpan>
            Symbol <InfoTooltip>Ticker symbol of the bAsset</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        value={symbol}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setSymbol(target.value)
        }
      />

      <div className="description">
        <p>
          <IconSpan>
            Token Contract Address{' '}
            <InfoTooltip>Address of bAsset token contract</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        placeholder="Address"
        value={tokenContractAddress}
        error={!!invalidTokenContractAddress}
        helperText={invalidTokenContractAddress}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setTokenContractAddress(target.value)
        }
      />

      <div className="description">
        <p>
          <IconSpan>
            Price Feeder{' '}
            <InfoTooltip>
              Address of the oracle price feeder for this bAsset
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        placeholder="Address"
        value={priceFeeder}
        error={!!invalidPriceFeeder}
        helperText={invalidPriceFeeder}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setPriceFeeder(target.value)
        }
      />

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
        placeholder="0"
        maxIntegerPoinsts={3}
        maxDecimalPoints={0}
        value={maxLtv}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setMaxLtv(target.value)
        }
      />

      <div className="description">
        <p>
          <IconSpan>
            Custody Contract Address{' '}
            <InfoTooltip>
              Address of custody contract for this bAsset
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        placeholder="Address"
        value={custodyContractAddress}
        error={!!invalidCustodyContractAddress}
        helperText={invalidCustodyContractAddress}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setCustodyContractAddress(target.value)
        }
      />
    </PollCreateBase>
  );
}

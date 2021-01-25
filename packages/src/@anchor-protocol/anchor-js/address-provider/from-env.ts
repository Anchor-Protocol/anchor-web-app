import { reactifyEnv } from './react-app-prefix';
import { AddressProvider } from './provider';

//console.log(process.env);

export class AddressProviderFromEnvVar implements AddressProvider {
  bAssetReward(denom: string): string {
    return getFromEnv('bAssetReward');
  }

  bAssetHub(denom: string): string {
    return getFromEnv('bLuna');
  }

  bAssetToken(denom: string): string {
    return getFromEnv('bAssetToken');
  }

  bAsset(denom: string): string {
    return getFromEnv('bAsset');
  }

  market(denom: string): string {
    return getFromEnv('mmMarket');
  }

  custody(): string {
    return getFromEnv('mmCustody');
  }

  overseer(): string {
    return getFromEnv('mmOverseer');
  }

  aToken(): string {
    return getFromEnv('aUST');
  }

  oracle(): string {
    return getFromEnv('mmOracle');
  }

  interest(): string {
    return getFromEnv('mmInterest');
  }

  liquidation(): string {
    return getFromEnv('mmLiquidation');
  }

  terraswapFactory(): string {
    return getFromEnv('terraswapFactory');
  }

  blunaBurn(nativeDenom: string): string {
    return JSON.parse(getFromEnv('bLunaBurn'))[nativeDenom];
  }
}

function getFromEnv(key: string): string {
  const val = process.env[reactifyEnv(key)];
  if (typeof val === 'undefined') {
    throw new Error(`address provider could not resolve key ${key}`);
  }
  return val;
}

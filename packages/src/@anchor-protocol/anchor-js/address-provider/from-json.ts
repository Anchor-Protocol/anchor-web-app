import { AddressProvider } from './provider';

interface JsonData {
  bLunaHub: string;
  bAssetToken: string;
  bAssetReward: string;
  mmInterest: string;
  mmOracle: string;
  mmMarket: string;
  mmOverseer: string;
  mmCustody: string;
  mmLiquidation: string;
  anchorToken: string;
  terraswapFactory: string;
  terraswapPair: string;
  blunaBurn: { [nativeDenom: string]: string };
}

export class AddressProviderFromJson implements AddressProvider {
  constructor(private data: JsonData) {}

  bAssetReward(denom: string): string {
    return this.data.bAssetReward;
  }

  bAssetHub(denom: string): string {
    return this.data.bLunaHub;
  }

  bAssetToken(denom: string): string {
    return this.data.bAssetToken;
  }

  market(denom: string): string {
    return this.data.mmMarket;
  }

  custody(): string {
    return this.data.mmCustody;
  }

  overseer(): string {
    return this.data.mmOverseer;
  }

  aToken(): string {
    return this.data.anchorToken;
  }

  oracle(): string {
    return this.data.mmOracle;
  }

  interest(): string {
    return this.data.mmInterest;
  }

  liquidation(): string {
    return this.data.mmLiquidation;
  }

  terraswapFactory(): string {
    return this.data.terraswapFactory;
  }

  blunaBurn(quote: string): string {
    const address = this.data.blunaBurn[quote];
    if (typeof address === 'undefined') {
      throw new Error(`there is not address for ${quote}`);
    }
    return address;
  }
}

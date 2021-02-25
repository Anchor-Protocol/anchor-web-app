import { AddressProvider } from './provider';

export interface AddressProviderJsonData {
  bLunaHub: string;
  bAssetToken: string;
  bAssetReward: string;
  bAssetAirdrop: string;
  mmInterest: string;
  mmOracle: string;
  mmMarket: string;
  mmOverseer: string;
  mmCustody: string;
  mmLiquidation: string;
  mmdistribution: string;
  anchorToken: string;
  terraswapFactory: string;
  blunaBurnPair: string;
  blunaBurnuluna: string;
  blunaUlunaPair: string;
  blunaUlunaToken: string;
  anchorUusdPair: string;
  anchorUusdToken: string;
  gov: string;
  faucet: string;
  collector: string;
  community: string;
  staking: string;
  token: string;
  airdrop: string;
}

export class AddressProviderFromJson implements AddressProvider {
  constructor(private data: AddressProviderJsonData) {}

  bAssetHub(denom: string): string {
    return this.data.bLunaHub;
  }

  bAssetToken(denom: string): string {
    return this.data.bAssetToken;
  }

  bAssetReward(denom: string): string {
    return this.data.bAssetReward;
  }

  bAssetAirdrop(denom: string): string {
    return this.data.bAssetAirdrop;
  }

  interest(): string {
    return this.data.mmInterest;
  }

  oracle(): string {
    return this.data.mmOracle;
  }

  market(denom: string): string {
    return this.data.mmMarket;
  }

  overseer(): string {
    return this.data.mmOverseer;
  }

  custody(): string {
    return this.data.mmCustody;
  }

  liquidation(): string {
    return this.data.mmLiquidation;
  }

  distribution(): string {
    return this.data.mmdistribution;
  }

  aToken(): string {
    return this.data.anchorToken;
  }

  terraswapFactory(): string {
    return this.data.terraswapFactory;
  }

  blunaBurnPair(): string {
    return this.data.blunaBurnPair;
  }

  blunaBurn(quote: string): string {
    return this.data.blunaBurnuluna;
  }

  blunaUlunaPair(): string {
    return this.data.blunaUlunaPair;
  }

  blunaUlunaToken(): string {
    return this.data.blunaUlunaToken;
  }

  anchorUusdPair(): string {
    return this.data.anchorUusdPair;
  }

  anchorUusdToken(): string {
    return this.data.anchorUusdToken;
  }

  gov(): string {
    return this.data.gov;
  }

  faucet(): string {
    return this.data.faucet;
  }

  collector(): string {
    return this.data.collector;
  }

  community(): string {
    return this.data.community;
  }

  staking(): string {
    return this.data.staking;
  }

  token(): string {
    return this.data.token;
  }

  airdrop(): string {
    return this.data.airdrop;
  }
}

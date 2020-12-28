declare namespace AddressProvider {
  export interface Provider {
    bAssetReward(denom: string): string;
    bAssetGov(denom: string): string;
    bAssetToken(denom: string): string;
    market(denom: string): string;
    custody(denom: string): string;
    overseer(denom: string): string;
    aToken(denom: string): string;
    oracle(): string;
  }
}

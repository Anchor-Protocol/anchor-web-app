declare namespace AddressProvider {
  export interface Provider {
    bAssetReward(denom: string): string;
    bAssetHub(denom: string): string;
    bAssetToken(denom: string): string;
    // https://github.com/Anchor-Protocol/money-market-contracts/tree/master/artifacts
    // moneymarket_market.wasm
    market(denom: string): string;
    custody(denom: string): string;
    overseer(denom: string): string;
    aToken(denom: string): string;
    oracle(): string;
  }
}

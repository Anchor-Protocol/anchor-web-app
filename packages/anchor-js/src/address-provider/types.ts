interface AddressProvider {
    market(denom: string): string
    custody(): string
    overseer(): string
    aToken(): string
    oracle(): string
}
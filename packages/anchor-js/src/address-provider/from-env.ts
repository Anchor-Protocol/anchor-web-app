import { AddressProvider } from './types'

export class AddressProviderFromEnvVar implements AddressProvider.Provider {
    bAsset(denom: string): string {
        throw new Error('Method not implemented.');
    }
    market(denom: string): string {
        throw new Error('Method not implemented.');
    }
    custody(): string {
        throw new Error('Method not implemented.');
    }
    overseer(): string {
        throw new Error('Method not implemented.');
    }
    aToken(): string {
        throw new Error('Method not implemented.');
    }
    oracle(): string {
        throw new Error('Method not implemented.');
    }

}
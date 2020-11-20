import createContext from "../hooks/create-context"

export const [useAddressProvider, AddressProviderProvider] = createContext<AddressProvider.Provider>("addressProvider")
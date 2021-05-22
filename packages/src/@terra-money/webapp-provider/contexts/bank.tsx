import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useLongtimeNoSee } from '@terra-dev/use-longtime-no-see';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import {
  CW20Contract,
  TaxData,
  taxQuery,
  tokenBalancesQuery,
} from '@terra-money/webapp-fns';
import deepEqual from 'fast-deep-equal';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DEFAULT_NATIVE_TOKEN_KEYS } from '../env';
import { useTerraWebapp } from './context';

export interface TokenBalancesProviderProps {
  children: ReactNode;

  /**
   * native token keys
   *
   * @example
   * ```
   * {
   *   uUST: 'uusd',
   *   uLuna: 'uluna',
   * }
   * ```
   */
  nativeTokenKeys?: Record<string, string>;

  /**
   * cw20 token contracts
   *
   * @example
   * ```
   * {
   *   mainnet: {
   *     uaUST: { contractAddress: 'xxxxxxxx' },
   *     ubLuna: { contractAddress: 'xxxxxxxx' },
   *   },
   *   testnet: {
   *     uaUST: { contractAddress: 'xxxxxxxx' },
   *     ubLuna: { contractAddress: 'xxxxxxxx' },
   *   },
   * }
   * ```
   */
  cw20TokenContracts: Record<string, Record<string, CW20Contract>>;

  /**
   * max cap denoms
   *
   * @example
   * ```
   * {
   *   uUST: 'uusd',
   * }
   * ```
   */
  maxCapTokenDenoms: Record<string, string>;
}

export interface Bank<
  TokenBalancesType = Record<string, string>,
  TaxDataType = TaxData
> {
  tokenBalances: TokenBalancesType;
  refetchTokenBalances: () => Promise<TokenBalancesType>;

  tax: TaxDataType;
  refetchTax: () => Promise<TaxDataType>;
}

const BankContext: Context<Bank> = createContext<Bank>({
  tokenBalances: {},
  refetchTokenBalances: () => Promise.resolve({}),
  tax: {
    taxRate: '0',
  },
  refetchTax: () =>
    Promise.resolve({
      taxRate: '0',
    }),
});

export function BankProvider({
  children,
  nativeTokenKeys = DEFAULT_NATIVE_TOKEN_KEYS,
  cw20TokenContracts,
  maxCapTokenDenoms,
}: TokenBalancesProviderProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { browserInactive } = useBrowserInactive();

  const { status, network, wallets } = useWallet();

  const { mantleEndpoint, mantleFetch } = useTerraWebapp();

  // ---------------------------------------------
  // empty data
  // ---------------------------------------------
  const emptyTokenBalances = useMemo<Record<string, string>>(() => {
    const data: Partial<Record<string, string>> = {};

    Object.keys(nativeTokenKeys).forEach((tokenKey) => {
      data[tokenKey] = '0';
    });

    const [networkName] = Object.keys(cw20TokenContracts);

    Object.keys(cw20TokenContracts[networkName]).forEach((tokenKey) => {
      data[tokenKey] = '0';
    });

    return data as Record<string, string>;
  }, [cw20TokenContracts, nativeTokenKeys]);

  const emptyTax = useMemo<TaxData>(() => {
    const data: TaxData = {
      taxRate: '1',
    };

    Object.keys(maxCapTokenDenoms).forEach((tokenKey) => {
      data[tokenKey] = '3500000';
    });

    return data;
  }, [maxCapTokenDenoms]);

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const browserInactiveRef = useRef(browserInactive);

  useEffect(() => {
    browserInactiveRef.current = browserInactive;
  }, [browserInactive]);

  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    emptyTokenBalances,
  );

  const [tax, setTax] = useState<TaxData>(emptyTax);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const fetchTokenBalances = useMemo<
    () => Promise<Record<string, string>>
  >(() => {
    return status === WalletStatus.WALLET_CONNECTED && wallets.length > 0
      ? () =>
          tokenBalancesQuery({
            nativeTokenKeys,
            cw20TokenContracts: cw20TokenContracts[network.name],
            walletAddress: wallets[0].terraAddress,
            mantleEndpoint,
            mantleFetch,
          })
      : () => Promise.resolve(emptyTokenBalances);
  }, [
    cw20TokenContracts,
    emptyTokenBalances,
    mantleEndpoint,
    mantleFetch,
    nativeTokenKeys,
    network.name,
    status,
    wallets,
  ]);

  const fetchTax = useMemo<() => Promise<TaxData>>(() => {
    return () =>
      taxQuery({
        mantleEndpoint,
        mantleFetch,
        maxCapTokenDenoms,
      });
  }, [mantleEndpoint, mantleFetch, maxCapTokenDenoms]);

  const fetchTokenBalancesRef = useRef(fetchTokenBalances);

  const fetchTaxRef = useRef(fetchTax);

  useEffect(() => {
    if (!browserInactive) {
      fetchTokenBalances().then((nextTokenBalances) => {
        setTokenBalances((prevTokenBalances) => {
          return !deepEqual(prevTokenBalances, nextTokenBalances)
            ? nextTokenBalances
            : prevTokenBalances;
        });
      });
    }
    fetchTokenBalancesRef.current = fetchTokenBalances;
  }, [browserInactive, fetchTokenBalances]);

  useEffect(() => {
    if (!browserInactive) {
      fetchTax().then((nextTax) => {
        setTax((prevTax) => {
          return !deepEqual(prevTax, nextTax) ? nextTax : prevTax;
        });
      });
    }
    fetchTaxRef.current = fetchTax;
  }, [browserInactive, fetchTax]);

  const refetchTokenBalances = useCallback(() => {
    return fetchTokenBalancesRef.current().then((nextTokenBalances) => {
      setTokenBalances((prevTokenBalances) => {
        return !deepEqual(prevTokenBalances, nextTokenBalances)
          ? nextTokenBalances
          : prevTokenBalances;
      });
      return nextTokenBalances;
    });
  }, []);

  const refetchTax = useCallback(() => {
    return fetchTaxRef.current().then((nextTax) => {
      setTax((prevTax) => {
        return !deepEqual(prevTax, nextTax) ? nextTax : prevTax;
      });
      return nextTax;
    });
  }, []);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useLongtimeNoSee({
    longtime: 1000 * 60,
    onSee: () => {
      refetchTokenBalances();
      refetchTax();
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!browserInactiveRef.current) {
        fetchTokenBalancesRef.current().then((nextTokenBalances) => {
          setTokenBalances((prevTokenBalances) => {
            return !deepEqual(prevTokenBalances, nextTokenBalances)
              ? nextTokenBalances
              : prevTokenBalances;
          });
        });

        fetchTaxRef.current().then((nextTax) => {
          setTax((prevTax) => {
            return !deepEqual(prevTax, nextTax) ? nextTax : prevTax;
          });
        });
      }
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // ---------------------------------------------
  // output
  // ---------------------------------------------
  const states = useMemo<Bank>(
    () => ({
      tokenBalances,
      refetchTokenBalances,
      tax,
      refetchTax,
    }),
    [refetchTax, refetchTokenBalances, tax, tokenBalances],
  );

  return <BankContext.Provider value={states}>{children}</BankContext.Provider>;
}

export function useBank<
  TokenBalancesType = Record<string, string>,
  TaxDataType = TaxData
>(): Bank<TokenBalancesType, TaxDataType> {
  return (useContext(BankContext) as unknown) as Bank<
    TokenBalancesType,
    TaxDataType
  >;
}

export const BankConsumer: Consumer<Bank> = BankContext.Consumer;

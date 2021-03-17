import { ApolloClient, ApolloError } from '@apollo/client';
import { ContractAddress } from '@anchor-protocol/types';
import { createContext, useContext, Context, Consumer } from 'react';
import type { ReactNode } from 'react';

export interface QueryDependencyProviderProps extends QueryDependency {
  children: ReactNode;
}

export interface QueryDependency {
  client: ApolloClient<any>;
  onError?: (error: ApolloError) => void;
  address: ContractAddress;
}

// @ts-ignore
const QueryDependencyContext: Context<QueryDependency> = createContext<QueryDependency>();

export function QueryDependencyProvider({
  children,
  ...dependency
}: QueryDependencyProviderProps) {
  return (
    <QueryDependencyContext.Provider value={dependency}>
      {children}
    </QueryDependencyContext.Provider>
  );
}

export function useQueryDependency(): QueryDependency {
  return useContext(QueryDependencyContext);
}

export const QueryDependencyConsumer: Consumer<QueryDependency> =
  QueryDependencyContext.Consumer;

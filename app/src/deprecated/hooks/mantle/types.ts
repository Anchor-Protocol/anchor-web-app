import { ApolloError } from '@apollo/client';

export type MantleResponse<T extends object> = T;
export type MantleResponseWithHeight<T extends object | string> = {
  Height: string;
  Result: T;
};

export type MantleContractResponse = MantleResponseWithHeight<string>;

// parse out Result part from MantleResponseWithHeight
export const pickResult = <T extends object>(
  data: MantleResponseWithHeight<T>,
) => data.Result;
export const pickContractResult = <Result extends object | string>(
  response: MantleContractResponse,
): Result => JSON.parse(response.Result as string);

export type MantleHookReturnType<T> = [
  boolean,
  ApolloError | undefined,
  T | null,
];

export type MantleRefetch = () => void;

import { FieldNode } from 'graphql';
import { WasmQueryData, WasmQueryInput, WasmQueryRawData } from '../interface';

export function wasmQueryToFields<T>(queries: WasmQueryInput<T>): FieldNode[] {
  const keys = Object.keys(queries) as Array<keyof T>;

  return keys
    .map((key) => [
      {
        kind: 'Field',
        alias: {
          kind: 'Name',
          value: key,
        },
        name: {
          kind: 'Name',
          value: 'WasmContractsContractAddressStore',
        },
        arguments: [
          {
            kind: 'Argument',
            name: {
              kind: 'Name',
              value: 'ContractAddress',
            },
            value: {
              kind: 'StringValue',
              value: queries[key]['contractAddress'],
            },
          },
          {
            kind: 'Argument',
            name: {
              kind: 'Name',
              value: 'QueryMsg',
            },
            value: {
              kind: 'StringValue',
              value: JSON.stringify(queries[key]['query']),
            },
          },
        ],
        directives: [],
        selectionSet: {
          kind: 'SelectionSet',
          selections: [
            {
              kind: 'Field',
              name: {
                kind: 'Name',
                value: 'Result',
              },
            },
          ],
        },
      } as FieldNode,
    ])
    .flat();
}

export function parseWasmQueryRawData<T>(
  data: WasmQueryRawData<T>,
  keys: Array<keyof T> = Object.keys(data) as Array<keyof T>,
): WasmQueryData<T> {
  return keys.reduce((res, key) => {
    res[key] = JSON.parse(data[key].Result);
    return res;
  }, {} as WasmQueryData<T>);
}

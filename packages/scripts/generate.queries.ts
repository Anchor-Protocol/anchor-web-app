import fs from 'fs-extra';
import path from 'path';
import { format, resolveConfig } from 'prettier';
import { src } from './env';
import { getResponsePairContractTypes } from './getResponsePairContractTypes';

interface Names {
  name: string; // anchorToken.gov.Config
  className: string; // AnchorTokenGovConfig
  idName: string; // anchorToken_gov_Config
  parentName: string; // anchorToken.gov
}

const queryTemplate = ({ name, idName, className, parentName }: Names) => `
export function use${className}({
  address,
  ...options
}: Omit<UseWasmQueryOptions<${name}>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<${name}, ${name}Response>({
    ...options,
    id: '${idName}',
    address: address.${parentName},
  });
}

export function query${className}(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<${name}>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<${name}, ${name}Response>(
    client,
    {
      ...options,
      id: '${idName}',
      address: address.${parentName},
    },
  );
}
`;

const fileTemplate = (imports: string[], body: string) => `
// THIS FILE WAS AUTO GENERATED
// DO NOT EDIT MANUALLY
// YOU CAN SEE THE GENERATOR SCRIPTS ON PACKAGE.JSON

import { ${imports.join(', ')}, ContractAddress } from '@anchor-protocol/types';
import { ApolloClient } from '@apollo/client';
import { Omit } from '@material-ui/core';
import {
  useWasmQuery,
  UseWasmQueryOptions,
  wasmQuery,
  WasmQueryOptions,
} from './wasmQuery';

${body}
`;

(async () => {
  const targetInterfaces = await getResponsePairContractTypes([
    'anchorToken',
    'bluna',
    'liquidation',
    'moneyMarket',
  ]);

  const typesImports = new Set(targetInterfaces.map((i) => i.split('.')[0]));

  const names = targetInterfaces.map<Names>((name) => {
    const paths = name.split('.');

    return {
      name,
      className: paths
        .map((pathName) => pathName[0].toUpperCase() + pathName.slice(1))
        .join(''),
      idName: name.replace(/\./g, '_'),
      parentName: paths.slice(0, paths.length - 1).join('.'),
    };
  });

  const queries = names.map(queryTemplate);
  const source = fileTemplate(Array.from(typesImports), queries.join('\n\n'));

  const file = path.resolve(
    src,
    '@anchor-protocol/queries/contractQueries_gen.ts',
  );

  const prettierOptions = await resolveConfig(file);

  const formattedSource = format(source, {
    ...prettierOptions,
    parser: 'typescript',
  });

  await fs.writeFile(file, formattedSource, { encoding: 'utf8' });
})();

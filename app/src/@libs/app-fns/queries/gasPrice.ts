import { GasPrice } from '../models/gasPrice';

let cache: GasPrice | null = null;

export async function gasPriceQuery(
  gasPriceEndpoint: string,
): Promise<GasPrice> {
  if (cache) {
    return cache;
  }

  const gasPrice = await fetch(gasPriceEndpoint).then((res) => res.json());

  cache = gasPrice;

  return gasPrice;
}

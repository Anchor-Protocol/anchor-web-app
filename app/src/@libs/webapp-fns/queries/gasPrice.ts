import { gasPriceCache } from '../caches/gasPrice';
import { GasPrice } from '../models/gasPrice';

export async function gasPriceQuery(
  gasPriceEndpoint: string,
): Promise<GasPrice> {
  const gasPrice = await fetch(gasPriceEndpoint).then((res) => res.json());

  gasPriceCache.set(gasPriceEndpoint, gasPrice);

  return gasPrice;
}

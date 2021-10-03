import { CW20Addr } from '@anchor-protocol/types';

export const createCollateralVector =
  <T, R>(picker: (item: T) => [CW20Addr, R], fill?: R) =>
  (vector: CW20Addr[], items: T[]): R[] => {
    const map = new Map<CW20Addr, R>();

    for (const item of items) {
      map.set(...picker(item));
    }

    return vector.map((addr) => map.get(addr) ?? fill!);
  };

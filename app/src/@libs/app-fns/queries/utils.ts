import {
  TxInfo,
  TxLog,
  Event as TxEvent,
  EventKV as TxAttribute,
} from '@terra-money/terra.js';

export function pickLog(txInfo: TxInfo, index: number): TxLog | undefined {
  return txInfo.logs && txInfo.logs[index];
}

export function pickEvent(txLog: TxLog, type: string): TxEvent | undefined {
  return txLog.events.find((event) => event.type === type);
}

export function pickAttributeValue<T extends string>(
  fromContract: TxEvent,
  index: number,
): T | undefined {
  const attr = fromContract.attributes[index];
  return attr ? (attr.value as T) : undefined;
}

export function pickAttributeValueByKey<T extends string>(
  fromContract: TxEvent,
  key: string,
  pick?: (attrs: TxAttribute[]) => TxAttribute,
): T | undefined {
  const attrs = fromContract.attributes.filter((attr) => key === attr.key);

  if (attrs.length > 1) {
    return (pick?.(attrs) ?? attrs[0])?.value as T | undefined;
  }
  return attrs[0]?.value as T | undefined;
}

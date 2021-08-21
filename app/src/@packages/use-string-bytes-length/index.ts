import { useMemo } from 'react';

export function countUtf8Bytes(s: string): number {
  let b = 0,
    i = 0,
    c;
  for (; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
  return b;
}

export enum BytesValid {
  MUCH = 'much',
  LESS = 'less',
}

export function useStringBytesLength(str: string): number {
  return useMemo(() => {
    return countUtf8Bytes(str);
  }, [str]);
}

export function useValidateStringBytes(
  str: string,
  minBytes: number,
  maxBytes: number,
): BytesValid | undefined {
  return useMemo(() => {
    if (str.trim().length === 0) {
      return undefined;
    }

    const bytes = countUtf8Bytes(str);

    return bytes <= minBytes
      ? BytesValid.LESS
      : bytes >= maxBytes
      ? BytesValid.MUCH
      : undefined;
  }, [maxBytes, minBytes, str]);
}

import { renderHook } from '@testing-library/react-hooks';
import {
  BytesValid,
  countUtf8Bytes,
  useStringBytesLength,
  useValidateStringBytes,
} from '../';

describe('use-string-bytes-length', () => {
  test('should get valid results', () => {
    expect(countUtf8Bytes('aaaa')).toBe(4);

    const { result: result0 } = renderHook(() => useStringBytesLength('aaaaa'));
    expect(result0.current).toBe(5);

    const { result: result1 } = renderHook(() =>
      useValidateStringBytes('aaaaa', 2, 10),
    );
    expect(result1.current).toBeUndefined();

    const { result: result2 } = renderHook(() =>
      useValidateStringBytes('aaaaa', 6, 10),
    );
    expect(result2.current).toBe(BytesValid.LESS);

    const { result: result3 } = renderHook(() =>
      useValidateStringBytes('aaaaa', 2, 4),
    );
    expect(result3.current).toBe(BytesValid.MUCH);
  });
});

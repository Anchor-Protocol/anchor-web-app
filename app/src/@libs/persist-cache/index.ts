interface CacheBlock<T> {
  timestamp: number;
  value: T;
}

export class PersistCache<T> {
  private readonly cache: Record<string, CacheBlock<T>>;

  constructor(
    private storageKey: string,
    private staleTime: number | undefined = undefined,
    private storage: Storage | undefined = typeof localStorage !== 'undefined'
      ? localStorage
      : undefined,
  ) {
    this.cache = JSON.parse(storage?.getItem(storageKey) ?? '{}');
  }

  set = (key: string, value: T) => {
    this.cache[key] = { timestamp: Date.now(), value };
    this.storage?.setItem(this.storageKey, JSON.stringify(this.cache));
  };

  get = (key: string): T | undefined => {
    const block = this.cache[key];
    if (
      !block ||
      !('timestamp' in block && 'value' in block) ||
      (typeof this.staleTime === 'number' &&
        block.timestamp + this.staleTime > Date.now())
    ) {
      return undefined;
    } else {
      return block.value;
    }
  };

  has = (key: string): boolean => {
    return !!this.get(key);
  };
}

export class PersistCache<T> {
  private readonly cache: Record<string, T>;

  constructor(
    private storageKey: string,
    private storage: Storage | undefined = typeof localStorage !== 'undefined'
      ? localStorage
      : undefined,
  ) {
    this.cache = JSON.parse(storage?.getItem(storageKey) ?? '{}');
  }

  set = (key: string, value: T) => {
    this.cache[key] = value;
    this.storage?.setItem(this.storageKey, JSON.stringify(this.cache));
  };

  get = (key: string): T | undefined => {
    return this.cache[key];
  };

  has = (key: string): boolean => {
    return !!this.cache[key];
  };
}

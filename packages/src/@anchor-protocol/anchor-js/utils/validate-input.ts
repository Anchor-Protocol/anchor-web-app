export type InputEntry = [
  // predicate
  boolean | (() => boolean),

  // error message
  string,
];

export const validateInput = (inputEntries: InputEntry[]): boolean =>
  inputEntries.every((entry) => {
    const predicate = typeof entry[0] === 'function' ? entry[0]() : entry[0];
    if (!predicate) throw new Error(entry[1]);
    return true;
  });

// we are using a naming convention and also getting rid of "bAssets"
// at some point so this should be an ok thing to do temporarily
export const isBAsset = (symbol: string): boolean => {
  return (
    symbol.toLowerCase().startsWith('b') && symbol.toLowerCase() !== 'bluna'
  );
};

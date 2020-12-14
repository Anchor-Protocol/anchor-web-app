export const truncate = (text = '', [h, t]: number[] = [6, 6]) => {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
};

export const escapeJSON = (json: object) =>
  JSON.stringify(json)
    .replace(/\n/g, '\\n')
    .replace(/\'/g, "\\'")
    .replace(/\"/g, '\\"')
    .replace(/\&/g, '\\&')
    .replace(/\r/g, '')
    .replace(/\t/g, '')
    .replace(/\b/g, '')
    .replace(/\f/g, '');

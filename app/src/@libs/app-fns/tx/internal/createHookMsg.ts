export const createHookMsg = (msg: object): string =>
  Buffer.from(JSON.stringify(msg)).toString('base64');

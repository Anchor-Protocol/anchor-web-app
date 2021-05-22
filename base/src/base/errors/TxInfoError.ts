import { Data as TxInfoData } from '../queries/txInfos';

// TODO remove after refactoring done
export class TxInfoError extends Error {
  constructor(public readonly log: TxInfoData[number]['RawLog']) {
    super(JSON.stringify(log));
    this.name = 'TxInfoError';
  }

  toString = () => {
    return `[${this.name}]\n${JSON.stringify(this.log, null, 2)}`;
  };
}

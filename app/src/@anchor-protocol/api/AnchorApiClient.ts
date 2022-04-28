import { GovRewardsResponse } from './types';

export class AnchorApiClient {
  private readonly _endpoint: string;

  constructor(endpoint: string) {
    this._endpoint = endpoint;
  }

  getGovRewards = async (): Promise<GovRewardsResponse> => {
    const response = await fetch(`${this._endpoint}/v2/gov-reward`);
    return await response.json();
  };
}

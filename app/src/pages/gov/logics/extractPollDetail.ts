import { anchorToken } from '@anchor-protocol/types';
import big from 'big.js';

export interface PollDetail {
  poll: anchorToken.gov.PollResponse;

  vote: {
    yes: number;
    no: number;
    possibleVotes: number;
    threshold: number;
  };

  type: string;

  endsIn: Date;

  executeData: any | null;
}

export function extractPollDetail(
  poll: anchorToken.gov.PollResponse,
  govConfig: anchorToken.gov.ConfigResponse,
  currentHeight: number,
): PollDetail {
  const possibleVotes: number = +poll.total_balance_at_end_poll;
  const yes: number = +poll.yes_votes;
  const no: number = +poll.no_votes;

  const endsIn: Date = new Date(
    (poll.end_height - currentHeight) * 6000 + Date.now(),
  );

  let executeData: any = null;

  try {
    executeData = poll.execute_data
      ? JSON.parse(atob(poll.execute_data.msg))
      : null;
  } catch (error) {
    console.log('extractPollDetail.ts..extractPollDetail()', error);
  }

  const type = executeData?.hasOwnProperty('spend')
    ? 'Community Spend'
    : executeData?.hasOwnProperty('update_config')
    ? 'Parameter Change'
    : 'TEXT';

  return {
    poll,

    vote: {
      yes,
      no,
      possibleVotes,
      threshold: big(yes + no)
        .mul(govConfig.threshold)
        .toNumber(),
    },

    type,

    endsIn,

    executeData,
  };
}

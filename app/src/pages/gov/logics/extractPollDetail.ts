import { anchorToken } from '@anchor-protocol/types';
import { PollMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
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

  msg: PollMsg | null;
}

export function extractPollDetail(
  poll: anchorToken.gov.PollResponse,
  govConfig: anchorToken.gov.ConfigResponse,
  currentHeight: number,
): PollDetail {
  const possibleVotes: number = poll.total_balance_at_end_poll
    ? +poll.total_balance_at_end_poll
    : 1;
  const yes: number = +poll.yes_votes;
  const no: number = +poll.no_votes;

  const endsIn: Date = new Date(
    (poll.end_height - currentHeight) * 6000 + Date.now(),
  );

  let msg: PollMsg | null = null;

  if (Array.isArray(poll.execute_data)) {
    msg = JSON.parse(atob(poll.execute_data[0].msg));
  }

  let type: string = 'TEXT';

  if (msg) {
    if ('spend' in msg) {
      type = 'Community Spend';
    } else if ('update_config' in msg) {
      type = 'Parameter Change';
    } else if ('update_whitelist' in msg) {
      type = 'Update Whitelist';
    }
  }

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

    msg,
  };
}

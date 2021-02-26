import big from 'big.js';
import { GovConfig, Poll } from 'pages/gov/queries/polls';

export interface PollDetail {
  poll: Poll;

  vote: {
    yes: number;
    no: number;
    possibleVotes: number;
    threshold: number;
  };

  type: string;

  endsIn: Date;
}

export function extractPollDetail(
  poll: Poll,
  govConfig: GovConfig,
  currentHeight: number,
): PollDetail {
  const possibleVotes: number = +poll.total_balance_at_end_poll;
  const yes: number = +poll.yes_votes;
  const no: number = +poll.no_votes;

  const endsIn: Date = new Date(
    (poll.end_height - currentHeight) * 6000 + Date.now(),
  );

  const executeData = poll.execute_data ? atob(poll.execute_data.msg) : null;

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
  };
}

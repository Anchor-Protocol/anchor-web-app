import { formatRateToPercentage } from '@anchor-protocol/notation';
import { anchorToken, cw20, Rate, uANC } from '@anchor-protocol/types';
import { PollMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
import big from 'big.js';

export interface PollDetail {
  poll: anchorToken.gov.PollResponse;

  vote: {
    yes: number;
    no: number;
    total: number;
    threshold: number;
  };

  quorum: {
    current: number;
    gov: number;
  };

  baseline: {
    value: number;
    label: string;
  };

  type: string;

  endsIn: Date;

  msg: PollMsg | null;
}

export function extractPollDetail(
  poll: anchorToken.gov.PollResponse,
  govANCBalance: cw20.BalanceResponse<uANC>,
  govState: anchorToken.gov.StateResponse,
  govConfig: anchorToken.gov.ConfigResponse,
  currentHeight: number,
): PollDetail {
  const total: number =
    poll.status !== 'in_progress' && poll.total_balance_at_end_poll
      ? +poll.total_balance_at_end_poll
      : poll.staked_amount
      ? +poll.staked_amount
      : big(govANCBalance.balance).minus(govState.total_deposit).toNumber();

  const yes: number = +poll.yes_votes;

  const no: number = +poll.no_votes;

  const threshold: number = big(yes + no)
    .mul(govConfig.threshold)
    .toNumber();

  const quorum = {
    current: (yes + no) / total,
    gov: +govConfig.quorum,
  };

  const baseline =
    quorum.current > quorum.gov
      ? {
          value: threshold * total,
          label: 'Pass Threshold',
        }
      : {
          value: quorum.gov * total,
          label: `Quorum ${formatRateToPercentage(
            quorum.gov as Rate<number>,
          )}%`,
        };

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
      total,
      threshold,
    },

    quorum,

    baseline,

    type,

    endsIn,

    msg,
  };
}

import { formatANC } from '@anchor-protocol/notation';
import { anchorToken, moneyMarket } from '@anchor-protocol/types';
import { AnchorContractAddress } from '@anchor-protocol/app-provider';
import { demicrofy, formatRate } from '@libs/formatter';
import { AccountLink } from 'components/links/AccountLink';
import { createElement, ReactNode } from 'react';

export function getMsgDetails(
  address: AnchorContractAddress,
  msg: anchorToken.gov.ParsedExecuteMsg | undefined | null,
): { name: string; value: ReactNode }[] {
  if (msg?.msg) {
    // specific parsing
    if (msg.contract === address.anchorToken.community && 'spend' in msg.msg) {
      const communitySpend: anchorToken.community.Spend = msg.msg;

      return [
        {
          name: 'Recipient',
          value: createElement(AccountLink, {
            address: communitySpend.spend.recipient,
          }),
        },
        {
          name: 'Amount',
          value: formatANC(demicrofy(communitySpend.spend.amount)) + ' ANC',
        },
      ];
    } else if (
      msg.contract === address.moneyMarket.overseer &&
      'whitelist' in msg.msg
    ) {
      const registerWhitelist: moneyMarket.overseer.RegisterWhitelist = msg.msg;

      return [
        {
          name: 'Collateral Name',
          value: registerWhitelist.whitelist.name,
        },
        {
          name: 'Symbol',
          value: registerWhitelist.whitelist.symbol,
        },
        {
          name: 'Token Contract Address',
          value: createElement(AccountLink, {
            address: registerWhitelist.whitelist.collateral_token,
          }),
        },
        {
          name: 'Custody Contract Address',
          value: createElement(AccountLink, {
            address: registerWhitelist.whitelist.custody_contract,
          }),
        },
        {
          name: 'Max LTV',
          value: formatRate(registerWhitelist.whitelist.max_ltv) + '%',
        },
      ];
    } else if (
      msg.contract === address.moneyMarket.oracle &&
      'register_feeder' in msg.msg
    ) {
      const registerFeeder: moneyMarket.oracle.RegisterFeeder = msg.msg;

      return [
        {
          name: 'Asset',
          value: createElement(AccountLink, {
            address: registerFeeder.register_feeder.asset,
          }),
        },
        {
          name: 'Feeder',
          value: createElement(AccountLink, {
            address: registerFeeder.register_feeder.feeder,
          }),
        },
      ];
    }

    // fallbacks
    if ('spend' in msg.msg) {
      return Object.keys(msg.msg['spend']).map((name) => {
        return {
          name: name[0].toUpperCase() + name.slice(1),
          // @ts-ignore
          value: msg.msg['spend'][name],
        };
      });
    } else if ('update_config' in msg.msg) {
      return Object.keys(msg.msg['update_config']).map((name) => {
        return {
          name,
          // @ts-ignore
          value: msg.msg['update_config'][name],
        };
      });
    } else if ('update_whitelist' in msg.msg) {
      return Object.keys(msg.msg['update_whitelist']).map((name) => {
        return name === 'collateral_token'
          ? {
              name: 'Collateral',
              value: createElement(AccountLink, {
                // @ts-ignore
                address: msg.msg['update_whitelist'][name],
              }),
            }
          : {
              name: 'Max LTV',
              // @ts-ignore
              value: msg.msg['update_whitelist'][name],
            };
      });
    }
  }

  return [];
}

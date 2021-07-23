import { anchorToken } from '@anchor-protocol/types';

export function getMsgTitle(
  msg: anchorToken.gov.ParsedExecuteMsg | undefined | null,
): string {
  if (msg?.msg) {
    if ('spend' in msg.msg) {
      return 'Community Spend';
    } else if ('update_config' in msg.msg) {
      return 'Parameter Change';
    } else if ('update_whitelist' in msg.msg) {
      return 'Update Whitelist';
    }
  }

  return 'TEXT';
}

export function isRegisterCollateralAttribute(
  msgs: anchorToken.gov.ParsedExecuteMsg[],
): boolean {
  return (
    msgs.length === 2 &&
    msgs.some(({ msg }) => 'whitelist' in msg) &&
    msgs.some(({ msg }) => 'register_feeder' in msg)
  );
}

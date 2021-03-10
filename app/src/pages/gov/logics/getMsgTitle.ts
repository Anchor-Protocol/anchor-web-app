import { ParsedExecuteMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';

export function getMsgTitle(msg: ParsedExecuteMsg | undefined | null): string {
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

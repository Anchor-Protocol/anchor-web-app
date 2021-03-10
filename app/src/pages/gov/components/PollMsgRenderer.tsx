import { ParsedExecuteMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';

export interface PollMsgRendererProps {
  msg: ParsedExecuteMsg | null | undefined;
}

export function PollMsgRenderer({ msg }: PollMsgRendererProps) {
  if (!msg) {
    return <div>Empty Msg</div>;
  }

  return <pre>{JSON.stringify(msg, null, 2)}</pre>;
}

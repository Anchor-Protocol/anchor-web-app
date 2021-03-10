import { ReactNode } from 'react';

export function validateLinkAddress(link: string): ReactNode {
  if (link.length === 0) return undefined;
  if (!/^(http|https):\/\//.test(link)) {
    return 'Must begin with http:// or https://';
  }
  return undefined;
}

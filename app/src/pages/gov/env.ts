import { onProduction } from 'base/env';

export const govPathname = 'gov';
export const ancUstLpPathname = 'anc-ust-lp';
export const ancGovernancePathname = 'anc-governance';
export const ustBorrowPathname = 'ust-borrow';

export const MINIMUM_CLAIM_BALANCE = 1;
export const MAX_SPREAD = onProduction ? 0.1 : 0.99;

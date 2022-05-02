import {
  useAncBalanceQuery,
  useAnchorWebapp,
  useAncTokenInfoQuery,
} from '@anchor-protocol/app-provider';
import { ANC } from '@anchor-protocol/types';
import { HumanAddr, u } from '@libs/types';
import big, { Big } from 'big.js';
import { useGovStateQuery, useGovConfigQuery } from 'queries';
import { useMemo } from 'react';

export interface AncTokenomics {
  totalSupply: u<ANC<Big>>;
  circulatingSupply: u<ANC<Big>>;
  totalStaked: u<ANC<Big>>;
}

export const useAncTokenomics = (): AncTokenomics | undefined => {
  const { contractAddress } = useAnchorWebapp();

  const { data: { ancTokenInfo } = {} } = useAncTokenInfoQuery();

  const { data: { ancBalance: govANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.gov,
  );

  const { data: { ancBalance: communityANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.community,
  );

  const { data: { ancBalance: distributorANCBalance } = {} } =
    useAncBalanceQuery(contractAddress.anchorToken.distributor);

  // FIXME remain lp total staked
  const { data: { ancBalance: lpStakingANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.staking,
  );

  const { data: { ancBalance: airdropANCBalance } = {} } = useAncBalanceQuery(
    'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm' as HumanAddr,
  );

  const { data: { ancBalance: investorTeamLockANCBalance } = {} } =
    useAncBalanceQuery(
      'terra1dp0taj85ruc299rkdvzp4z5pfg6z6swaed74e6' as HumanAddr,
    );

  const { data: govState } = useGovStateQuery();
  const { data: govConfig } = useGovConfigQuery();

  return useMemo(() => {
    if (
      !ancTokenInfo ||
      !govANCBalance ||
      !communityANCBalance ||
      !distributorANCBalance ||
      !lpStakingANCBalance ||
      !airdropANCBalance ||
      !investorTeamLockANCBalance ||
      !govState ||
      !govConfig
    ) {
      return undefined;
    }

    const totalStaked = big(govANCBalance.balance).minus(
      govState.total_deposit,
    ) as u<ANC<Big>>;

    const circulatingSupply = big(ancTokenInfo.total_supply)
      .minus(communityANCBalance.balance)
      .minus(distributorANCBalance.balance)
      .minus(lpStakingANCBalance.balance)
      .minus(airdropANCBalance.balance)
      .minus(investorTeamLockANCBalance.balance);

    return {
      totalSupply: Big(ancTokenInfo.total_supply) as u<ANC<Big>>,
      circulatingSupply: circulatingSupply as u<ANC<Big>>,
      totalStaked,
    };
  }, [
    airdropANCBalance,
    ancTokenInfo,
    communityANCBalance,
    distributorANCBalance,
    govANCBalance,
    govConfig,
    govState,
    investorTeamLockANCBalance,
    lpStakingANCBalance,
  ]);
};

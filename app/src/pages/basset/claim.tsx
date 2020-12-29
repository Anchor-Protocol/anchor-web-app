import { fabricatebAssetClaim } from '@anchor-protocol/anchor-js/fabricators';
import { fabricatebAssetUpdateGlobalIndex } from '@anchor-protocol/anchor-js/fabricators/basset-update-global-index';
import React from 'react';
import Amount from '../../components/amount';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ready } from '../../components/ready';
import { ActionContainer } from '../../containers/action';
import useBassetClaimable from '../../hooks/mantle/use-basset-claimable';
import { useWallet } from '../../hooks/use-wallet';
import { useAddressProvider } from '../../providers/address-provider';

import style from './basset.module.scss';

interface BassetClaimProps {}

const BassetClaim: React.FunctionComponent<BassetClaimProps> = () => {
  const { address } = useWallet();
  const addressProvider = useAddressProvider();
  //const [withdrawState, setWithdrawState] = useState({ amount: '0.00' });

  const [loading, error, claimable = '0'] = useBassetClaimable();

  const isReady = !loading && !error;

  return ready(isReady, () => (
    <div className={style['basset-container']}>
      <article className={style.business}>
        <Box>
          <header>Available Luna</header>
          <div>
            <Amount amount={+claimable} denom="Luna" />
          </div>
          <footer>
            <ActionContainer
              render={(execute) => (
                <Button
                  type={ButtonTypes.PRIMARY}
                  transactional={true}
                  onClick={() => alert('oops')}
                >
                  Withdraw
                </Button>
              )}
            />
          </footer>
        </Box>
        <Box>
          <header>Claimable Rewards</header>
          <div>
            <Amount amount={+claimable} denom="UST" />
          </div>
          <footer>
            <ActionContainer
              render={(execute) => (
                <Button
                  type={ButtonTypes.PRIMARY}
                  onClick={() =>
                    execute(
                      fabricatebAssetClaim({
                        address,
                        recipient: address,
                        bAsset: addressProvider.bAssetToken('uluna'),
                      }),
                    )
                  }
                  transactional={true}
                >
                  Claim
                </Button>
              )}
            />
          </footer>
        </Box>
      </article>

      {/* owner operations */}
      <div>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.DEFAULT}
              transactional={true}
              onClick={() =>
                execute(
                  fabricatebAssetUpdateGlobalIndex({
                    address,
                    bAsset: 'bluna',
                  }),
                )
              }
            >
              Update Global Index
            </Button>
          )}
        />
      </div>
    </div>
  ));
};

export default BassetClaim;

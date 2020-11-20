import { fabricatebAssetClaim } from '../../anchor-js/fabricators'
import React, { useState } from 'react'
import Amount from '../../components/amount'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import { ActionContainer } from '../../containers/action'
import { useWallet } from '../../hooks/use-wallet'
import { useAddressProvider } from '../../providers/address-provider'

import style from './basset.module.css'
import BassetSelection from './components/selection'

interface BassetClaimProps {}

const BassetClaim: React.FunctionComponent<BassetClaimProps> = () => {
  const { address } = useWallet()
  const addressProvider = useAddressProvider()
  const [withdrawState, setWithdrawState] = useState({ amount: "0.00" })


  return (
    <div className={style['basset-container']}>
      <BassetSelection/>
      <article className={style.business}>
        <Box>
          <header>Available Luna</header>
          <div>
            <Amount amount={10000000000} denom="Luna" />
          </div>
          <footer>
            <ActionContainer render={execute => (
              <Button
                type={ButtonTypes.PRIMARY}
                transactional={true}
                onClick={() => alert('oops')}
              >Withdraw</Button>
            )}/>
          </footer>
        </Box>
        <Box>
          <header>Claimable Rewards</header>
          <div>
            <Amount amount={2444444444} denom="UST" />
          </div>
          <footer>
            <ActionContainer render={execute => (
              <Button
                type={ButtonTypes.PRIMARY}
                onClick={() => execute(fabricatebAssetClaim({
                  address,
                  recipient: address,
                  bAsset: addressProvider.bAssetToken('uluna'),
                }))}
                transactional={true}
              >Claim</Button>
            )}/>
          </footer>
        </Box>
      </article>
    </div>
  )
}

export default BassetClaim
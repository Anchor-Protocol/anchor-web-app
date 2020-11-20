import React, { useState } from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import BassetInput from './components/basset-input'
import BassetSelection from './components/selection'

import style from './basset.module.css'
import { useWallet } from '../../hooks/use-wallet'
import { ActionContainer } from '../../containers/action'
import { fabricatebAssetBurn } from '../../anchor-js/fabricators'
import { useAddressProvider } from '../../providers/address-provider'

interface BassetBurnProps {}

const BassetBurn: React.FunctionComponent<BassetBurnProps> = () => {
  const { address } = useWallet()
  const addressProvider = useAddressProvider()
  const [burnState, setBurnState] = useState(0.00)

  // TODO: get exchange rate

  return (
    <div className={style['basset-container']}>
      <BassetSelection/>
      <article className={style.business}>
        <Box>
          <BassetInput
            caption="I want to burn"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            onChange={setBurnState}
            amount={burnState}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and get"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={200.00}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>
          ~
        </aside>
      </article>

      <footer>
        <ActionContainer render={execute => (
          <Button
            type={ButtonTypes.PRIMARY}
            transactional={true}
            onClick={() => execute(fabricatebAssetBurn({
              address,
              amount: burnState.toString(),
              bAsset: addressProvider.bAssetToken('uluna'),
            }))}
          >Burn</Button>
        )}/>
      </footer>
    </div>
  )
}

export default BassetBurn

import React, { useState } from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import BassetInput from './components/basset-input'
import BassetSelection from './components/selection'

import style from './basset.module.css'
import { ActionContainer } from '../../containers/action'
import { fabricatebAssetMint } from '../../anchor-js/fabricators'
import { useWallet } from '../../hooks/use-wallet'
import { useAddressProvider } from '../../providers/address-provider'

interface BassetMintProps {
  
}

const BassetMint: React.FunctionComponent<BassetMintProps> = ({
  children,
}) => {
  const { address } = useWallet()
  const addressProvider = useAddressProvider()
  const [mintState, setMintState] = useState(0.00)

  console.log(mintState)

  return (
    <div className={style['basset-container']}>
      <BassetSelection/>
      <article className={style.business}>
        <Box>
          <BassetInput
            caption="I want to bond"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={mintState}
            onChange={setMintState}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and mint"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            amount={mintState * 0.99}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>
          ~
        </aside>

        {/* Validator selection */}
        <select>
          <option disabled={true}>Select Validator</option>
          <option>Paradise Jesse</option>
        </select>
      </article>

      <footer>
        <ActionContainer render={execute => (
          <Button
            type={ButtonTypes.PRIMARY}
            transactional={true}
            onClick={() => execute(fabricatebAssetMint({
              address,
              amount: mintState,
              bAsset: addressProvider.bAssetToken('bluna'),
              validator: "terra1"
            }))}
          >Mint</Button>
        )}/>
      </footer>
    </div>
  )
}

export default BassetMint

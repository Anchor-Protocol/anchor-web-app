import { Msg, StdFee } from '@terra-money/terra.js'
import React from 'react'
import { useWallet } from '../hooks/use-wallet'
import { useAddressProvider } from '../providers/address-provider'
import { useNetwork } from '../providers/network'
import extension, { PostResponse } from '../terra/extension'

interface ActionContainerProps {
  render: (execute: (fabricated: Fabricated) => Promise<PostResponse>) => React.ReactElement
}

type Fabricated = (ap: AddressProvider.Provider) => Msg[]

export const ActionContainer: React.FunctionComponent<ActionContainerProps> = ({
  render
}) => {
  const network = useNetwork()
  const addressProviders = useAddressProvider()
  const { address, connect } = useWallet()

  const submit = (fabricated: Fabricated) => new Promise<PostResponse>((resolve, reject) => {
    extension.post({
      msgs: fabricated(addressProviders),
      fee: new StdFee(200000, "100000uluna"),
    },
    (response) => {
      console.log(response)
      if(response.success) reject(response.error)
      else resolve(response)
    })
  })

  return address
    ? render(submit)
    : <button onClick={() => connect()}>connect wallet</button>
}
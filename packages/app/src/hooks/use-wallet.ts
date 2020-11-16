// import { useMutation } from "@apollo/client"
import useLocalStorage from "./use-localstorage"
import extension from "../terra/extension"
// import { CONNECT } from "../statistics/gqldocs"
// import { useStatsClient } from "../statistics/useStats"
import createContext from "./create-context"

interface Wallet {
  /** Terra wallet address */
  address: string
  /** Set as installed */
  install: () => void
  /** Extension installed */
  installed: boolean
  /** Connect wallet */
  connect: () => void
  /** Disconnect wallet */
  disconnect: () => void
}

export const [useWallet, WalletProvider] = createContext<Wallet>("useWallet")

/* state */
export const useWalletState = (): Wallet => {
  /* init */
  const init = extension.init()
  const [installed, setInstalled] = useLocalStorage("extension", init)
  const install = () => setInstalled(true)

  /* connect */
  const [address, setAddress] = useLocalStorage("address", "")

  // const client = useStatsClient()
  // const [connectToGraph] = useMutation(CONNECT, { client })
  const connect = () =>
    extension.connect((address) => {
      setAddress(address)
      // connectToGraph({ variables: { address } })
    })

  const disconnect = () => setAddress("")

  return { address, install, installed, connect, disconnect }
}
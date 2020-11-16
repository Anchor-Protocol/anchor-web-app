import { Extension, SyncTxBroadcastResult } from "@terra-money/terra.js"
import { CreateTxOptions, LCDClientConfig, StdFee } from "@terra-money/terra.js"
import { plus } from "../libs/math"

export type Result = SyncTxBroadcastResult.Data
export interface PostResponse {
  id: number
  origin: string
  success: boolean
  result?: Result
  error?: { code: number; message?: string }
}

interface Options extends CreateTxOptions {
  lcdClientConfig: LCDClientConfig
}

const ext = new Extension()
export default {
  init: () => !!ext.isAvailable,

  connect: (callback: (address: string) => void) => {
    ext.connect()
    ext.on("onConnect", ({ address }: { address: string }) => callback(address))
  },

  post: (
    options: Options,
    txFee: { gasPrice: number; amount: number; tax?: string },
    callback: (params: PostResponse) => void
  ) => {
    const { gasPrice, amount, tax } = txFee
    const gas = Math.round(amount / gasPrice)
    const lcdClientConfig = {
      ...options.lcdClientConfig,
      gasPrices: { uusd: gasPrice },
      fee: new StdFee(gas, { uusd: plus(amount, tax) }).toData(),
    }

    const id = ext.post({ ...options, purgeQueue: true, lcdClientConfig })
    ext.on("onPost", callback)
    return id
  },
}
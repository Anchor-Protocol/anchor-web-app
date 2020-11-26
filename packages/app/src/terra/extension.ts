import { Extension, SyncTxBroadcastResult } from "@terra-money/terra.js"
import { CreateTxOptions } from "@terra-money/terra.js"

export type Result = SyncTxBroadcastResult.Data
export interface PostResponse {
  id: number
  origin: string
  success: boolean
  result?: Result
  error?: { code: number; message?: string }
}

const ext = new Extension()
export default {
  init: () => !!ext.isAvailable,

  connect: (callback: (params: { address: string }) => void) => {
    ext.connect()
    ext.on("onConnect", callback)
  },

  post: (
    options: CreateTxOptions,
    callback: (params: PostResponse) => void
  ) => {
    const id = ext.post({
      ...options,
      purgeQueue: true,
    })

    ext.on("onPost", callback)
    return id
  },
}
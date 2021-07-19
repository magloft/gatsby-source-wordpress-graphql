import { PluginOptions as BasePluginOptions } from 'gatsby'
import { Context } from 'unihtml'

export type CacheAdapterType = 'gatsby' | 'persist'

export type ImportResource = 'post' | 'page' | 'user' | 'category' | 'media'

export interface PluginOptions extends BasePluginOptions {
  host: string
  authorization: string
  perPage: number
  cacheOnly?: boolean
  batchSize: number
  cacheAdapter: CacheAdapterType
  transformContent?: (context: Context) => void
  importResources?: ImportResource[]
}

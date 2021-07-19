import { SourceNodesArgs } from 'gatsby'
import { Cache } from './lib/Cache'
import { CacheAdapterGatsby } from './lib/CacheAdapter/CacheAdapterGatsby'
import { CacheAdapterPersist } from './lib/CacheAdapter/CacheAdapterPersist'
import { MediaItemImporter } from './lib/MediaItemImporter'
import { WordpressClient } from './lib/WordpressClient'
import { ModelContext } from './Models/Model'
import { WordpressCategory } from './Models/WordpressCategory'
import { WordpressMediaItem } from './Models/WordpressMediaItem'
import { WordpressPage } from './Models/WordpressPage'
import { WordpressPost } from './Models/WordpressPost'
import { WordpressUser } from './Models/WordpressUser'
import { PluginOptions } from './types/PluginOptions'
import { filterMediaItems } from './util/content'

export const CacheAdapterMap = {
  'gatsby': CacheAdapterGatsby,
  'persist': CacheAdapterPersist
}

export interface MediaItemRecord {
  id: string
  relation: string
  target: string
}

export async function sourceNodes(args: SourceNodesArgs, { host, authorization, cacheAdapter, perPage, cacheOnly, batchSize, transformContent, importResources }: PluginOptions): Promise<void> {
  const adapter = new CacheAdapterMap[cacheAdapter](args)
  const cache = new Cache(adapter)
  const mediaItemImporter = new MediaItemImporter({ args, cache, batchSize })
  const client = new WordpressClient({ host, authorization, cache, args, perPage, cacheOnly })
  const context: ModelContext = { createNodeId: args.createNodeId, createNode: args.actions.createNode, createContentDigest: args.createContentDigest, transformContent }

  // Retrieve Data
  const [posts, pages, users, categories, mediaItems] = await Promise.all([
    importResources.includes('post') ? client.getPosts().then((records) => WordpressPost.map(records, context)) : [],
    importResources.includes('page') ? client.getPages().then((records) => WordpressPage.map(records, context)) : [],
    importResources.includes('user') ? client.getUsers().then((records) => WordpressUser.map(records, context)) : [],
    importResources.includes('category') ? client.getCategories().then((records) => WordpressCategory.map(records, context)) : [],
    importResources.includes('media') ? client.getMediaItems().then((records) => WordpressMediaItem.map(records, context)) : []
  ])

  // Filter Media Items
  filterMediaItems(mediaItems, [...posts, ...pages])

  // Link Users with Pages and Posts
  for (const user of users) {
    user.data.posts = posts.filter(({ author }) => author === user.id).map(({ id }) => id)
    user.data.pages = pages.filter(({ author }) => author === user.id).map(({ id }) => id)
  }

  // Link Categories with Posts
  for (const category of categories) {
    category.data.posts = posts.filter(({ categories }) => categories.includes(category.id)).map(({ id }) => id)
  }

  // Import Media Items
  await mediaItemImporter.process(mediaItems)

  // Build Content Nodes
  for (const model of [...posts, ...pages, ...users, ...categories, ...mediaItems]) {
    model.build()
  }
}

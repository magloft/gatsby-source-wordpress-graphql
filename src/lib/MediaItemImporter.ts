import { Sema } from 'async-sema'
import fileType from 'file-type'
import { NodeInput, SourceNodesArgs } from 'gatsby'
import { createFileNodeFromBuffer, createRemoteFileNode, FileSystemNode } from 'gatsby-source-filesystem'
import { WordpressMediaItem } from '../Models/WordpressMediaItem'
import { Cache } from './Cache'
import { CacheAdapterPersist } from './CacheAdapter/CacheAdapterPersist'

export interface MediaItemImporterOptions {
  batchSize?: number
  args: SourceNodesArgs
  cache: Cache
}

export class MediaItemImporter {
  private batchSize: number
  private args: SourceNodesArgs
  private cache: Cache

  constructor({ batchSize, args, cache }: MediaItemImporterOptions) {
    this.batchSize = batchSize ?? 10
    this.args = args
    this.cache = cache
  }

  async process(mediaItems: WordpressMediaItem[]) {
    const progress = this.args.reporter.createProgress('wordpress-graphql: import media items', mediaItems.length, 0)
    progress.start()
    const sema = new Sema(this.batchSize, { capacity: mediaItems.length })
    const fileNodes = await Promise.all<NodeInput | null>(mediaItems.map(async (mediaItem) => {
      await sema.acquire()
      const fileNode = await this.importMediaItem(mediaItem)
      if (!fileNode) { return null }
      mediaItem.data.file = fileNode.id
      progress.tick()
      sema.release()
      return fileNode
    }))
    progress.done()
    return fileNodes.filter(Boolean)
  }

  async importMediaItem(mediaItem: WordpressMediaItem): Promise<FileSystemNode | null> {
    const { cache, store, reporter, createNodeId, actions: { createNode } } = this.args
    if (!mediaItem.sourceUrl) { return null }
    const name = mediaItem.id
    if (!(this.cache.adapter instanceof CacheAdapterPersist)) {
      return createRemoteFileNode({ url: encodeURI(mediaItem.sourceUrl), name, cache, store, reporter, createNode, createNodeId, parentNodeId: mediaItem.id })
    }
    const buffer = await this.cache.adapter.file(mediaItem.sourceUrl)
    const result = await fileType.fromBuffer(buffer)
    if (!result) { return null }
    const ext = result?.ext ?? 'jpg'
    return createFileNodeFromBuffer({ buffer, store, cache, createNode, createNodeId, parentNodeId: mediaItem.id, ext: `.${ext}`, name })
  }
}

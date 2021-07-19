import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import fetch from 'cross-fetch'
import { Reporter, SourceNodesArgs } from 'gatsby'
import {
  CategoryDataFragment,
  GetCategorysDocument,
  GetCategorysQuery,
  GetCategorysQueryVariables,
  GetMediaItemsDocument, GetMediaItemsQuery, GetMediaItemsQueryVariables, GetPagesDocument, GetPagesQuery, GetPagesQueryVariables,
  GetPostsDocument, GetPostsQuery, GetPostsQueryVariables, GetUsersDocument, GetUsersQuery, GetUsersQueryVariables, MediaItemDataFragment, PageDataFragment, PostDataFragment, UserDataFragment
} from '../graphql'
import { Cache } from './Cache'

export interface WordpressClientOptions {
  host: string
  authorization: string
  cache: Cache
  args: SourceNodesArgs
  perPage: number
  cacheOnly: boolean
}

export class WordpressClient {
  private perPage: number
  private cacheOnly: boolean
  private reporter: Reporter
  private cache: Cache
  private client: ApolloClient<NormalizedCacheObject>

  constructor(options: WordpressClientOptions) {
    this.perPage = options.perPage
    this.cacheOnly = options.cacheOnly
    this.reporter = options.args.reporter
    this.cache = options.cache
    const link = new HttpLink({ uri: options.host, headers: { 'Authorization': options.authorization }, fetch })
    const cache = new InMemoryCache
    this.client = new ApolloClient({ link, cache })
  }

  async getUsers(): Promise<UserDataFragment[]> {
    return this.fetchLatest<UserDataFragment>('users', async (pageInfo) => {
      const { data } = await this.client.query<GetUsersQuery, GetUsersQueryVariables>({ query: GetUsersDocument, variables: { before: pageInfo.startCursor, last: this.perPage } })
      if (!data || !data.users.pageInfo) { return { pageInfo: { hasPreviousPage: false }, records: [] } }
      return { pageInfo: data.users.pageInfo, records: data.users.nodes ?? [] }
    })
  }

  async getCategories(): Promise<CategoryDataFragment[]> {
    return this.fetchLatest<CategoryDataFragment>('categories', async (pageInfo) => {
      const { data } = await this.client.query<GetCategorysQuery, GetCategorysQueryVariables>({ query: GetCategorysDocument, variables: { before: pageInfo.startCursor, last: this.perPage } })
      if (!data || !data.categories.pageInfo) { return { pageInfo: { hasPreviousPage: false }, records: [] } }
      return { pageInfo: data.categories.pageInfo, records: data.categories.nodes ?? [] }
    })
  }

  async getPosts(): Promise<PostDataFragment[]> {
    return this.fetchLatest<PostDataFragment>('posts', async (pageInfo) => {
      const { data } = await this.client.query<GetPostsQuery, GetPostsQueryVariables>({ query: GetPostsDocument, variables: { before: pageInfo.startCursor, last: this.perPage } })
      if (!data || !data.posts.pageInfo) { return { pageInfo: { hasPreviousPage: false }, records: [] } }
      return { pageInfo: data.posts.pageInfo, records: data.posts.nodes ?? [] }
    })
  }

  async getPages(): Promise<PageDataFragment[]> {
    return this.fetchLatest<PageDataFragment>('pages', async (pageInfo) => {
      const { data } = await this.client.query<GetPagesQuery, GetPagesQueryVariables>({ query: GetPagesDocument, variables: { before: pageInfo.startCursor, last: this.perPage } })
      if (!data || !data.pages.pageInfo) { return { pageInfo: { hasPreviousPage: false }, records: [] } }
      return { pageInfo: data.pages.pageInfo, records: data.pages.nodes ?? [] }
    })
  }

  async getMediaItems(): Promise<MediaItemDataFragment[]> {
    return this.fetchLatest<MediaItemDataFragment>('mediaItems', async (pageInfo) => {
      const { data } = await this.client.query<GetMediaItemsQuery, GetMediaItemsQueryVariables>({ query: GetMediaItemsDocument, variables: { before: pageInfo.startCursor, last: this.perPage } })
      if (!data || !data.mediaItems.pageInfo) { return { pageInfo: { hasPreviousPage: false }, records: [] } }
      return { pageInfo: data.mediaItems.pageInfo, records: data.mediaItems.nodes.filter(({ sourceUrl }) => sourceUrl) ?? [] }
    })
  }

  private async fetchLatest<T>(cacheKey: string, fetchMore: (pageInfo: PageInfo) => Promise<PageResult<T>>): Promise<T[]> {
    const records: T[] = await this.cache.get<T[]>(cacheKey) ?? []
    if (records.length > 0 && this.cacheOnly) { return records }
    const syncProgress = this.reporter.createProgress(`wordpress-graphql: sync ${cacheKey}`, records.length + this.perPage, records.length)
    syncProgress.start()
    syncProgress.setStatus(`retrieved ${records.length} ${cacheKey}`)
    const pageInfo: PageInfo = { startCursor: await this.cache.get<string>(`${cacheKey}:startCursor`), hasPreviousPage: true }
    while (pageInfo.hasPreviousPage) {
      const result = await fetchMore(pageInfo)
      records.push(...result.records)
      syncProgress.total = records.length
      if (result.pageInfo.startCursor) { pageInfo.startCursor = result.pageInfo.startCursor }
      pageInfo.hasPreviousPage = result.pageInfo.hasPreviousPage
      if (pageInfo.hasPreviousPage) {
        syncProgress.total = records.length + 10
      }
      syncProgress.setStatus(`retrieved ${records.length} ${cacheKey}`)
      syncProgress.tick(result.records.length)
    }
    await this.cache.set(cacheKey, records)
    await this.cache.set<string>(`${cacheKey}:startCursor`, pageInfo.startCursor)
    syncProgress.total = records.length
    syncProgress.tick(0)
    syncProgress.done()
    return records
  }
}

export interface PageResult<T> {
  pageInfo: PageInfo
  records: T[]
}

export interface PageInfo {
  startCursor?: string
  hasPreviousPage: boolean
}

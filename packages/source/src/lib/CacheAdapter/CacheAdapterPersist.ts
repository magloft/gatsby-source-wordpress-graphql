import { existsSync, mkdirpSync, readFileSync, writeFileSync } from 'fs-extra'
import { SourceNodesArgs } from 'gatsby'
import md5 from 'md5'
import fetch from 'node-fetch'
import { CacheAdapter } from './CacheAdapter'

const ROOT = '.wordpress-graphql-cache'

export class CacheAdapterPersist extends CacheAdapter {
  private data: any

  constructor(args: SourceNodesArgs) {
    super(args)
    if (!existsSync(`${ROOT}`)) { mkdirpSync(`${ROOT}`) }
    if (!existsSync(`${ROOT}/files`)) { mkdirpSync(`${ROOT}/files`) }
    if (!existsSync(`${ROOT}/data.json`)) { writeFileSync(`${ROOT}/data.json`, '{}', 'utf8') }
    this.data = JSON.parse(readFileSync(`${ROOT}/data.json`, 'utf-8'))
  }

  async get<T>(key: string): Promise<T> {
    return this.data[key]
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.data[key] = value
    writeFileSync(`${ROOT}/data.json`, JSON.stringify(this.data), 'utf8')
  }

  async file(url: string) {
    const hash = md5(url)
    const filePath = `${ROOT}/files/${hash}`
    if (existsSync(filePath)) { return readFileSync(filePath) }
    const response = await fetch(encodeURI(url))
    const buffer = await response.buffer()
    writeFileSync(filePath, buffer)
    return buffer
  }
}

import { NodeInput } from 'gatsby'
import { Context } from 'unihtml'

export interface ModelInterface {
  id: string
  fields: string[]
}

export interface ModelContext {
  createNodeId(input: string): string
  createNode<TNode = Record<string, unknown>>(node: NodeInput & TNode, plugin?: { name: string }, options?: { [key: string]: unknown }): void
  createContentDigest(input: string | Record<string, unknown>): string
  transformContent?: (context: Context) => void
}

export interface ModelData {
  id: string
}

export interface StaticModel<T> { new (data: any, context: ModelContext): T }

export abstract class Model<D extends ModelData> implements ModelInterface {
  static map<T extends Model<any>>(this: StaticModel<T>, entries: any[], context: ModelContext): T[] {
    return entries.map<T>((data) => new this(data, context))
  }

  public data: D
  abstract get id(): string
  abstract get fields(): string[]

  constructor(data: D, public context: ModelContext) {
    this.data = { ...data }
  }

  build() {
    const data = this.fields.reduce((obj, name) => { obj[name] = this[name]; return obj }, {})
    const node = {
      id: this.id,
      ...data,
      parent: null,
      children: [],
      internal: { type: this.constructor.name, content: JSON.stringify(data), contentDigest: this.context.createContentDigest(data) }
    }
    this.context.createNode(node)
  }
}

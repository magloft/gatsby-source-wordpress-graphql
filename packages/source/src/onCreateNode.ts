import { CreateNodeArgs } from 'gatsby'

export async function onCreateNode(args: CreateNodeArgs) {
  const { node } = args
  switch (node.internal.type) {
  case 'WordpressPost': { break }
  case 'WordpressMediaItem': { break }
  default: { break }
  }
}

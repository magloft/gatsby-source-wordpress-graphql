import { Context, Node, parse, stringify, transform } from 'unihtml'
import { WordpressMediaItem } from '../Models/WordpressMediaItem'
import { WordpressPage } from '../Models/WordpressPage'
import { WordpressPost } from '../Models/WordpressPost'

export interface UniTree<T = string> {
  tree: Node
  html: string
  mediaItems: T[]
}

const compareUrlRegex = /(-[0-9]+x[0-9]+)?\.[a-z]+$/

export function processContent(html: string, transformContent?: (context: Context) => void) {
  const tree = parse(html)
  if (transformContent) { transform(tree, transformContent) }
  return tree
}

export function compareUrl(a: string, b: string) {
  return a.replace(compareUrlRegex, '') === b.replace(compareUrlRegex, '')
}

export function filterMediaItems(mediaItems: WordpressMediaItem[], records: (WordpressPost | WordpressPage)[]): void {
  const allMediaItems = new Set<WordpressMediaItem>()
  for (const record of records) {
    const matchedMediaItems = new Set<WordpressMediaItem>()
    transform(record.content.tree, ({ custom }) => {
      custom((node) => node.type === 'element' && node.tagName === 'img', (node, index) => {
        if (index === null || !node.properties.src) { return }
        const sourceUrl = node.properties.src.replace(compareUrlRegex, '')
        const matchedMediaItem = mediaItems.find((mediaItem) => compareUrl(mediaItem.sourceUrl, sourceUrl))
        if (!matchedMediaItem || !matchedMediaItem.sourceUrl) { return }
        node.properties.src = `mediaItem://${matchedMediaItem.id}`
        matchedMediaItems.add(matchedMediaItem)
        allMediaItems.add(matchedMediaItem)
      })
    })
    const featuredImage = mediaItems.find(({ id }) => id === record.featuredImage)
    if (featuredImage && featuredImage.sourceUrl) { allMediaItems.add(featuredImage) }
    record.content.mediaItems = Array.from(matchedMediaItems).map(({ id }) => id)
    record.content.html = stringify(record.content.tree)
  }
  mediaItems.length = 0
  mediaItems.push(...Array.from(allMediaItems))
}

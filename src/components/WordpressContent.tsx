import { Link, NodeInput } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import Parser, { domToReact, Element } from 'html-react-parser'
import React from 'react'
import { UniTree } from '../util/content'

export interface MediaItemNode extends NodeInput {
  title?: string
  altText?: string
  width?: number
  height?: number
  sourceUrl: string
  file: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

export interface WordpressContentProps {
  content: UniTree<MediaItemNode>
  replaceHost: string
}

export interface Attributes {
  [key: string]: string
}

export const MediaItemUrlRegex = /^mediaItem:\/\/(.+)$/

export class WordpressContent extends React.Component<WordpressContentProps> {
  render() {
    const hostUrl = new URL(this.props.replaceHost)
    const { html, mediaItems } = this.props.content
    const options = {
      replace: ({ type, tagName, attribs, children }: Element) => {
        if (type === 'tag' && tagName === 'img' && MediaItemUrlRegex.test(attribs.src)) {
          const [, mediaItemId] = attribs.src.match(MediaItemUrlRegex)
          const mediaItem = mediaItems.find(({ id }) => id === mediaItemId)
          if (!mediaItem || !mediaItem.file) { return null }
          const altText = mediaItem.altText ?? mediaItem.title ?? 'Image'
          return (mediaItem.file.childImageSharp)
            ? <GatsbyImage alt={altText} image={mediaItem.file.childImageSharp.gatsbyImageData} />
            : <img alt={altText} src={mediaItem.sourceUrl} />
        } else if (type === 'tag' && tagName === 'a' && attribs.href) {
          const { href, ...rest } = attribs
          rest.className = rest.class
          delete rest.class
          delete rest.style
          delete rest.target
          const url = new URL(href, hostUrl.origin)
          return (hostUrl != null && url.origin === hostUrl.origin)
            ? <Link to={url.pathname} {...rest}>{domToReact(children, options)}</Link>
            : <a href={attribs.href} target="_blank" rel="noreferrer" {...rest}>{domToReact(children, options)}</a>
        }
        return false
      }
    }
    return Parser(html, options)
  }
}

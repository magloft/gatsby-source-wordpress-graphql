import '@picocss/pico/css/pico.css'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { WordpressContent } from 'gatsby-source-wordpress-graphql'
import * as React from 'react'
import './index.scss'
import './wordpress.scss'

export const query = graphql`
  query AllWordpressPost {
    allWordpressPost(limit: 1) {
      nodes {
        id
        title
        featuredImage { altText, file { childImageSharp { gatsbyImageData(width: 1050) } } }
        content { html, mediaItems { id, title, altText, file { childImageSharp { gatsbyImageData(width: 688) } } } }
      }
    }
    sitePlugin(name: { eq: "gatsby-source-wordpress-graphql" }) { pluginOptions }
  }`

const IndexPage = (params) => {
  const { host } = params.data.sitePlugin.pluginOptions
  const [record] = params.data.allWordpressPost.nodes
  return (
    <React.Fragment>
      <nav className="container-fluid">
        <ul><li><strong>gatsby-source-wordpress-graphql</strong></li></ul>
        <ul><li><a href="https://github.com/magloft/gatsby-source-wordpress-graphql/" target="_blank" rel="noreferrer">Github</a></li></ul>
      </nav>
      <main className="container post-container">
        <article className="post">
          {record.featuredImage && record.featuredImage.file && record.featuredImage.file.childImageSharp && (
            <div className="feature-image">
              <GatsbyImage alt={record.featuredImage.altText} image={record.featuredImage.file.childImageSharp.gatsbyImageData}></GatsbyImage>
            </div>
          )}
          <WordpressContent content={record.content} replaceHost={host} />
        </article>
      </main>
    </React.Fragment>
  )
}

export default IndexPage

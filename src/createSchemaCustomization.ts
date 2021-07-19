import { CreateSchemaCustomizationArgs } from 'gatsby'

export function createSchemaCustomization({ actions: { createTypes }, schema }: CreateSchemaCustomizationArgs) {
  createTypes([
    schema.buildObjectType({
      name: 'WordpressContent',
      interfaces: ['Node'],
      fields: {
        html: 'String!',
        tree: { type: 'JSON!', extensions: { infer: false } },
        mediaItems: { type: '[WordpressMediaItem]', extensions: { link: {} } }
      },
      extensions: { infer: false }
    }),
    schema.buildObjectType({
      name: 'WordpressMediaItem',
      interfaces: ['Node'],
      fields: {
        id: 'ID!',
        title: 'String!',
        altText: 'String!',
        slug: 'String!',
        fileSize: 'Int!',
        mimeType: 'String!',
        sourceUrl: 'String!',
        width: 'Int!',
        height: 'Int!',
        file: { type: 'File', extensions: { link: {} } }
      },
      extensions: { infer: false }
    }),
    schema.buildObjectType({
      name: 'WordpressPost',
      interfaces: ['Node'],
      fields: {
        id: 'ID!',
        title: 'String!',
        slug: 'String!',
        date: 'Date!',
        featuredImage: { type: 'WordpressMediaItem', extensions: { link: {} } },
        author: { type: 'WordpressUser', extensions: { link: {} } },
        categories: { type: '[WordpressCategory]', extensions: { link: {} } },
        excerpt: 'String!',
        content: 'WordpressContent!',
        seoCanonical: 'String',
        seoTitle: 'String',
        seoDescription: 'String',
        seoKeywords: 'String',
        seoNoFollow: 'String',
        seoNoIndex: 'String'
      },
      extensions: { infer: false }
    }),
    schema.buildObjectType({
      name: 'WordpressPage',
      interfaces: ['Node'],
      fields: {
        id: 'ID!',
        title: 'String!',
        slug: 'String!',
        date: 'Date!',
        featuredImage: { type: 'WordpressMediaItem', extensions: { link: {} } },
        author: { type: 'WordpressUser', extensions: { link: {} } },
        content: 'WordpressContent!',
        seoCanonical: 'String',
        seoTitle: 'String',
        seoDescription: 'String',
        seoKeywords: 'String',
        seoNoFollow: 'String',
        seoNoIndex: 'String'
      },
      extensions: { infer: false }
    }),
    schema.buildObjectType({
      name: 'WordpressUser',
      interfaces: ['Node'],
      fields: {
        id: 'ID!',
        email: 'String!',
        firstName: 'String!',
        lastName: 'String!',
        description: 'String!',
        posts: { type: '[WordpressPost]', extensions: { link: {} } },
        pages: { type: '[WordpressPage]', extensions: { link: {} } }
      },
      extensions: { infer: false }
    }),
    schema.buildObjectType({
      name: 'WordpressCategory',
      interfaces: ['Node'],
      fields: {
        id: 'ID!',
        name: 'String!',
        slug: 'String!',
        description: 'String!',
        posts: { type: '[WordpressPost]', extensions: { link: {} } }
      },
      extensions: { infer: false }
    })
  ])
}

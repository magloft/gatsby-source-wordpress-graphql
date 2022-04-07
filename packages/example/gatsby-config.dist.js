module.exports = {
  pathPrefix: '/gatsby-source-wordpress-graphql',
  siteMetadata: { siteUrl: 'https://magloft.github.io/gatsby-source-wordpress-graphql/', title: 'gatsby-source-wordpress-graphql' },
  plugins: [
    {
      resolve: 'gatsby-source-wordpress-graphql',
      options: { host: 'https://www.domain.com/graphql', authorization: 'Basic ...', cacheAdapter: 'persist' }
    },
    { resolve: 'gatsby-plugin-sass' },
    { resolve: 'gatsby-plugin-image' },
    { resolve: 'gatsby-plugin-sharp' },
    { resolve: 'gatsby-transformer-sharp' }
  ]
}

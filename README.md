# gatsby-source-wordpress-graphql

Source plugin for pulling posts and media items from Wordpress via Graphql.

An example site for using this plugin hosted here:
https://magloft.github.io/gatsby-source-wordpress-graphql/

## Installation

```shell
npm install gatsby-source-wordpress-graphql
# OR
yarn add gatsby-source-wordpress-graphql
```

## How to use

Configure Plugin Options:
```js
{
  resolve: 'gatsby-source-wordpress-graphql',
  options: {
    // Your Wordpress GQL Endpoint
    host: 'https://www.domain.com/graphql',
    // HTTP Authorization Header
    authorization: 'Basic ...',
    // Cache Adapter, either `gatsby` or `persist`
    cacheAdapter: 'gatsby',
    // Records to fetch per request
    perPage: 100,
    // Media Item Import batch size
    batchSize: 10,
    // Content transformation options via unihtml
    transformContent: ({ clean }) => { clean() }
    // Skip checking for new resources after initial sync
    cacheOnly: false,
    // List of resources to import
    importResources: ['post', 'page', 'user', 'category', 'media']
  }
}
```

## Development

1. Build plugin using `yarn build`
2. Run `yarn link` in `dist/` folder
3. Run `yarn link gatsby-source-wordpress-graphql` in `example/` folder
4. Create `gatsby-config.js` in `example` folder (based on `dist` file) and fill in `authorization` details

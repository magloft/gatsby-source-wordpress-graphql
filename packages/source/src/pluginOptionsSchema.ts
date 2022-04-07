import { PluginOptionsSchemaArgs } from 'gatsby'

export function pluginOptionsSchema({ Joi }: PluginOptionsSchemaArgs) {
  return Joi.object({
    host: Joi.string().uri().description('Wordpress GraphQL Endpoint'),
    authorization: Joi.string().required().description('HTTP Authorization Header'),
    perPage: Joi.number().default(100).description('Records to fetch per request'),
    batchSize: Joi.number().default(10).description('Media Item Import batch size'),
    cacheAdapter: Joi.string().allow('gatsby', 'persist').default('gatsby').description('Cache Adapter (gatsby, persist)'),
    transformContent: Joi.function().description('Content transformation options via unihtml'),
    cacheOnly: Joi.boolean().default(false).description('Skip checking for new resources after initial sync'),
    importResources: Joi.array().items(Joi.string()
      .allow('post', 'page', 'user', 'category', 'media'))
      .default(['post', 'page', 'user', 'category', 'media'])
      .description('Array of resources to import (post, page, user, category, media)')
  })
}

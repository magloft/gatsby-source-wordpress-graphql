import { CategoryDataFragment } from '../graphql'
import { Model, ModelInterface } from './Model'

export class WordpressCategory extends Model<CategoryDataFragment & { posts?: string[] }> implements ModelInterface {
  get id() { return this.data.id }
  get fields() { return ['name', 'slug', 'description', 'seoCanonical', 'seoTitle', 'seoDescription', 'seoKeywords', 'seoNoFollow', 'seoNoIndex', 'posts'] }

  get name() { return this.data.name }
  get slug() { return this.data.slug }
  get description() { return this.data.description }
  get seoCanonical() { return this.data.seo?.canonical }
  get seoTitle() { return this.data.seo?.title }
  get seoDescription() { return this.data.seo?.metaDesc }
  get seoKeywords() { return this.data.seo?.metaKeywords }
  get seoNoFollow() { return this.data.seo?.metaRobotsNofollow }
  get seoNoIndex() { return this.data.seo?.metaRobotsNoindex }
  get posts() { return this.data.posts }
}

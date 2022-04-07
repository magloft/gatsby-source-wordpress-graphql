import { PostDataFragment } from '../graphql'
import { processContent, UniTree } from '../util/content'
import { Model, ModelInterface } from './Model'

export class WordpressPost extends Model<PostDataFragment> implements ModelInterface {
  get id() { return this.data.id }
  get fields() { return ['title', 'slug', 'date', 'excerpt', 'content', 'seoCanonical', 'seoTitle', 'seoDescription', 'seoKeywords', 'seoNoFollow', 'seoNoIndex', 'featuredImage', 'author', 'categories'] }

  get title() { return this.data.title }
  get slug() { return this.data.slug }
  get date() { return this.data.date }
  get excerpt() { return this.data.excerpt }
  public content: UniTree<string> = { tree: processContent(this.data.content, this.context.transformContent), mediaItems: [], html: '' }
  get seoCanonical() { return this.data.seo?.canonical }
  get seoTitle() { return this.data.seo?.title }
  get seoDescription() { return this.data.seo?.metaDesc }
  get seoKeywords() { return this.data.seo?.metaKeywords }
  get seoNoFollow() { return this.data.seo?.metaRobotsNofollow }
  get seoNoIndex() { return this.data.seo?.metaRobotsNoindex }

  // Links
  get featuredImage() { return this.data.featuredImage?.node?.id ? String(this.data.featuredImage?.node?.id) : undefined }
  get author() { return this.data.authorId }
  get categories() { return this.data.categories?.nodes ? this.data.categories.nodes.map(({ id }) => id) : [] }
}

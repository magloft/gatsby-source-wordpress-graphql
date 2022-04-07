import { MediaItemDataFragment } from '../graphql'
import { Model } from './Model'

export class WordpressMediaItem extends Model<MediaItemDataFragment & { file?: string }> {
  get id() { return this.data.id }
  get fields() { return ['title', 'altText', 'slug', 'fileSize', 'mimeType', 'sourceUrl', 'width', 'height', 'file'] }

  get title() { return this.data.title }
  get altText() { return this.data.altText }
  get slug() { return this.data.slug }
  get fileSize() { return this.data.fileSize }
  get mimeType() { return this.data.mimeType }
  get sourceUrl() { return this.data.sourceUrl }
  get width() { return this.data.mediaDetails?.width }
  get height() { return this.data.mediaDetails?.height }

  // Links
  get file() { return this.data.file }
}

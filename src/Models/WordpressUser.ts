import { UserDataFragment } from '../graphql'
import { Model, ModelInterface } from './Model'

export class WordpressUser extends Model<UserDataFragment & { posts?: string[]; pages?: string[] }> implements ModelInterface {
  get id() { return this.data.id }
  get fields() { return ['email', 'firstName', 'lastName', 'description', 'posts', 'pages'] }

  get email() { return this.data.email }
  get firstName() { return this.data.firstName }
  get lastName() { return this.data.lastName }
  get description() { return this.data.description }
  get posts() { return this.data.posts }
  get pages() { return this.data.pages }
}

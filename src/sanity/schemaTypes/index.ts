import { type SchemaTypeDefinition } from 'sanity'

import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { tagType } from './tagType'
import { blockContentType } from './blockContentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType, categoryType, tagType, blockContentType],
}
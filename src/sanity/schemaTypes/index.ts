import { type SchemaTypeDefinition } from 'sanity'

import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { tagType } from './tagType'
import { blockContentType } from './blockContentType'
import { seoType } from './seoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType, categoryType, tagType, blockContentType, seoType],
}
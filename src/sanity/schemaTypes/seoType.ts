import {Icon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {createElement} from 'react'

const SeoIcon = (props: Record<string, unknown>) =>
  createElement(Icon, {...props, symbol: 'search'})

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SeoIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Leave blank to use the post title. Keep under 60 characters.',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for best display in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Leave blank to use the excerpt. Keep under 160 characters.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best display in search results'),
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      description: 'The main search term this post should rank for.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Enable to prevent this post from being indexed by Google.',
      initialValue: false,
    }),
  ],
})
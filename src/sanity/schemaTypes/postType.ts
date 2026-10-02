import {Icon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {createElement} from 'react'

const PostIcon = (props: Record<string, unknown>) =>
  createElement(Icon, {...props, symbol: 'document-text'})

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: PostIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on post cards and the article header.',
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key takeaways',
      type: 'array',
      description:
        '3 to 5 short points that answer the main question of the post. Shown above the article and read by search and AI engines. Each point should make sense on its own, without the rest of the post.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) =>
            Rule.max(240).warning('Keep each point under 240 characters'),
        }),
      ],
      validation: (Rule) => Rule.max(6).warning('3 to 5 points works best'),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional images for this post. Pick one above as the cover image.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'tag'}})],
    }),
    defineField({
      name: 'readTime',
      title: 'Read time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'Update this whenever you refresh old content. Signals freshness to search engines.',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      description:
        'Questions readers actually ask about this topic, each with a direct answer of 2 to 4 sentences. Shown at the bottom of the article and added as FAQ structured data.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              rows: 4,
              title: 'Answer',
              validation: (Rule) => [
                Rule.required(),
                Rule.max(600).warning('Keep answers under 600 characters'),
              ],
            }),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(8).warning('3 to 6 questions works best'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
    },
    prepare(selection) {
      const {author, status} = selection
      return {
        ...selection,
        subtitle: [status === 'draft' ? 'Draft' : null, author && `by ${author}`]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})

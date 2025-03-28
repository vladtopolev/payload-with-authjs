import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'image', type: 'text' },
    { name: 'emailVerified', type: 'date' },
    {
      name: 'accounts',
      type: 'join',
      collection: 'accounts',
      on: 'user',
      admin: {
        defaultColumns: ['id', 'type', 'provider'],
      },
    },
  ],
}

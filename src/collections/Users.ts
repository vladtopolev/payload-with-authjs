import type { CollectionConfig } from 'payload'
import { auth, signOut } from '@/auth'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req: { user } }) => {
      // only superadmins and admins
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'authjs',
        authenticate: async ({ payload }) => {
          const session = await auth()
          if (!session || !session?.user?.id) {
            return { user: null }
          }

          const user = await payload.findByID({
            collection: 'users',
            id: Number(session.user.id),
            disableErrors: true,
          })

          return { user: user ? { ...user, collection: 'users' } : null }
        },
      },
    ],
  },
  endpoints: [
    {
      path: '/logout',
      method: 'post',
      handler: async () => {
        await signOut()
        return Response.json({
          message: 'You have been logged out successfully.',
        })
      },
    },
  ],
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text' },
    { name: 'image', type: 'text' },
    { name: 'emailVerified', type: 'date' },
    { name: 'password', type: 'text', hidden: true },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      defaultValue: 'user',
    },
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

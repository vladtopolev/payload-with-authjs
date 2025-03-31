import type { Adapter, AdapterAccount, AdapterUser, AdapterAccountType } from '@auth/core/adapters'
import { getPayload } from '@payload-config'
import { Account, User } from '@payload-types'
import { BasePayload } from 'payload'

let payloadClient: BasePayload | null = null

const createPayloadClient = async () => {
  if (payloadClient) {
    return payloadClient
  }
  payloadClient = await getPayload()
  return payloadClient
}

const covertPayloadUserToAdapterUser = (user: User): AdapterUser => {
  return {
    ...user,
    id: String(user.id),
    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
  }
}

const convertPayloadAccountToAdapterAccount = (account: Account): AdapterAccount => {
  const userId = String((account.user as User).id)
  const type = account.type as AdapterAccountType
  const { provider, providerAccountId } = account
  return { type, userId, provider, providerAccountId }
}

export function PayloadAuthAdapter(): Adapter {
  return {
    createUser: async ({ id, ...data }) => {
      const payload = await createPayloadClient()
      const user = await payload.create({
        collection: 'users',
        data: {
          email: data.email,
          name: data.name,
          emailVerified: data.emailVerified ? data.emailVerified.toISOString() : null,
          image: data.image,
        },
      })
      return covertPayloadUserToAdapterUser(user)
    },

    getUserByAccount: async (providerAccount) => {
      const { provider, providerAccountId } = providerAccount
      const payload = await createPayloadClient()
      const accountResponse = await payload.find({
        collection: 'accounts',
        where: {
          providerAccountId: { equals: providerAccountId },
          provider: { equals: provider },
        },
      })
      if (accountResponse.docs.length === 0) {
        return null
      }
      const account = accountResponse.docs[0]
      return covertPayloadUserToAdapterUser(account.user as User)
    },

    updateUser: async ({ id, ...data }) => {
      const payload = await createPayloadClient()
      const updatedUser = await payload.update({
        collection: 'users',
        id: Number(id),
        data: {
          email: data.email,
          name: data.name,
          emailVerified: data.emailVerified ? data.emailVerified.toISOString() : null,
          image: data.image,
        },
      })
      return covertPayloadUserToAdapterUser(updatedUser)
    },

    linkAccount: async (account) => {
      const payload = await createPayloadClient()
      const createdAccount = await payload.create({
        collection: 'accounts',
        data: {
          user: Number(account.userId),
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          type: account.type,
        },
      })
      return convertPayloadAccountToAdapterAccount(createdAccount)
    },

    getUser: async (id) => {
      const payload = await createPayloadClient()
      try {
        const user = await payload.findByID({
          collection: 'users',
          id: Number(id),
        })
        return covertPayloadUserToAdapterUser(user)
      } catch (error) {
        return null
      }
    },

    getUserByEmail: async (email) => {
      const payload = await createPayloadClient()
      const userResponse = await payload.find({
        collection: 'users',
        where: {
          email: { equals: email },
        },
      })
      if (userResponse.docs.length === 0) {
        return null
      }
      return covertPayloadUserToAdapterUser(userResponse.docs[0])
    },

    getAccount: async (providerAccountId, provider) => {
      const payload = await createPayloadClient()
      const accountResponse = await payload.find({
        collection: 'accounts',
        where: {
          providerAccountId: { equals: providerAccountId },
          provider: { equals: provider },
        },
      })
      if (accountResponse.docs.length === 0) {
        return null
      }
      return convertPayloadAccountToAdapterAccount(accountResponse.docs[0])
    },
  }
}

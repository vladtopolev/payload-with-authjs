import { PayloadAuthAdapter } from '@/services/auth/payloadAuthAdapter'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PayloadAuthAdapter(),
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub } }
    },
  },
})

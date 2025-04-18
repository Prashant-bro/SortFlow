import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    user: {
      /** The user's id. */
      id?: string
    } & DefaultSession["user"]
  }
}

import NextAuth from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]/route"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

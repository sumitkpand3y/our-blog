// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      image?: string
      username?: string // ✅ Add this
    }
  }

  interface User {
    username?: string
  }
}

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          let user = JSON.parse(credentials.user);
          // Everything is handled in the api/sigin post request, not here, because an error is caused due to Mongoose not being usable in the Edge runtime environment in Next.js.
          return user
        }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id; 
        token.fullName = user.fullName;
        token.email = user.email;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.isEmailVerified = token.isEmailVerified;
      }
      return session;
    }
  }
})
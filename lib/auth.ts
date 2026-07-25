import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return { id: user._id.toString(), email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({ name: user.name, email: user.email, image: user.image });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // account and user are only passed in on the very first sign-in
      if (account && user) {
        if (account.provider === "google") {
          // 🟢 FIX: Fetch the actual MongoDB _id for Google users
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } else {
          // 🟢 Credentials provider already gives us the Mongo _id
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
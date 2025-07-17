import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from "@/_lib/firebase-admin";
import { verifyPassword } from "@/_utils/saltAndHashPassword";

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  adapter: FirestoreAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error("Missing credentials");

        const snap = await db
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (snap.empty) throw new Error("No user found with this email");

        const doc = snap.docs[0];
        const userData = doc.data() as DBUser;

        const valid = await verifyPassword(password, userData.password);
        if (!valid) throw new Error("Invalid credentials");

        return {
          id: doc.id,
          name: userData.name,
          email: userData.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

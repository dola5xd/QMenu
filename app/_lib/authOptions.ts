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
  password: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: number;
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

        const valid = await verifyPassword(password, userData.password!);
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
    async signIn({ user, account, profile }) {
      if (!user?.email) return false;

      // Check if the user already exists
      const snap = await db
        .collection("users")
        .where("email", "==", user.email)
        .limit(1)
        .get();

      if (!snap.empty) {
        const existingDoc = snap.docs[0];
        const existingId = existingDoc.id;

        // Manually link Google account if needed
        if (account?.provider === "google") {
          const accountRef = db
            .collection("accounts")
            .doc(`${existingId}:google`);
          await accountRef.set({
            userId: existingId,
            type: "oauth",
            provider: "google",
            providerAccountId: profile?.sub ?? user.id,
          });
        }

        // Normalize missing fields in users collection
        const userData = existingDoc.data();
        if (!userData.password || userData.password === undefined) {
          await db
            .collection("users")
            .doc(existingId)
            .set(
              {
                id: existingId,
                name: user.name || "",
                email: user.email,
                image: user.image || null,
                password: null,
                emailVerified: true,
                createdAt: userData.createdAt || Date.now(),
              },
              { merge: true }
            );
        }
      } else {
        // User doesn't exist at all (Google first-time login)
        const newId = user.id || account?.userId || profile?.sub;
        if (newId) {
          await db
            .collection("users")
            .doc(newId)
            .set({
              id: newId,
              name: user.name || "",
              email: user.email,
              image: user.image || null,
              password: null,
              emailVerified: true,
              createdAt: Date.now(),
            });

          await db
            .collection("accounts")
            .doc(`${newId}:google`)
            .set({
              userId: newId,
              type: "oauth",
              provider: "google",
              providerAccountId: profile?.sub ?? newId,
            });
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

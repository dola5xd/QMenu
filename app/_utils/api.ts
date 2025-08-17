import { db } from "../_lib/firebase-admin";
import { DBUser } from "@/_lib/authOptions";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: number;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data() as Omit<DbUser, "id">;

  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    hashedPassword: data.hashedPassword,
    createdAt: data.createdAt,
  };
}

export async function getUserByID(ID: string): Promise<DBUser | null> {
  const snapshot = await db
    .collection("users")
    .where("id", "==", ID)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data() as DBUser;

  return data;
}

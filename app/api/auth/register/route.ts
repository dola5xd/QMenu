import { db } from "@/_lib/firebase-admin";
import { saltAndHashPassword } from "@/_utils/saltAndHashPassword";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existing.empty) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const userId = uuid();
  const hashed = await saltAndHashPassword(password);

  await db.collection("users").doc(userId).set({
    id: userId,
    name,
    email,
    password: hashed,
    emailVerified: null,
    image: null,
    createdAt: Date.now(),
  });

  await db.collection("accounts").doc(`${userId}:credentials`).set({
    userId: userId,
    type: "credentials",
    provider: "credentials",
    providerAccountId: email,
  });

  return NextResponse.json({ id: userId, email, name }, { status: 201 });
}

"use server";

import { DBUser } from "@/_lib/authOptions";
import { db } from "@/_lib/firebase-admin";
import {
  saltAndHashPassword,
  verifyPassword,
} from "@/_utils/saltAndHashPassword";

export async function updateUser(
  id: string,
  updatedUser: Partial<DBUser>,
  currentPassword?: string
) {
  try {
    const ref = db.collection("users").doc(id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return { error: "User not found" };
    }

    const user = snapshot.data() as DBUser;

    if (updatedUser.password) {
      if (user.password) {
        if (!currentPassword) {
          return { error: "Current password is required" };
        }

        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
          return { error: "Incorrect current password" };
        }
      }

      const hashedPassword = await saltAndHashPassword(updatedUser.password);
      updatedUser.password = hashedPassword;
    }

    await ref.update(updatedUser);

    return { success: true };
  } catch (error) {
    console.error("[updateUser]", error);
    return { error: "Failed to update user" };
  }
}

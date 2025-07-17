"use server";

import { db } from "@/_lib/firebase-admin";

export async function deleteMenu(id: string) {
  try {
    const ref = db.collection("menus").doc(id);
    await ref.delete();

    return { success: true };
  } catch (err) {
    console.error("[deleteMenu]", err);
    return { error: "Failed to delete menu" };
  }
}

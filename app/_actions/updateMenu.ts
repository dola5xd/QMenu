"use server";

import { db } from "@/_lib/firebase-admin";

export async function updateMenuVisibility(
  id: string,
  status: "public" | "private"
) {
  try {
    await db.collection("menus").doc(id).update({ status });
    return { success: true };
  } catch (error) {
    console.error("[updateMenuVisibility]", error);
    return { error: "Failed to update menu visibility" };
  }
}

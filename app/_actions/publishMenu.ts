"use server";

import { db } from "@/_lib/firebase-admin";

export async function publishMenu(
  id: string,
  status: "public" | "private",
  pdfUrl?: string
) {
  try {
    await db.collection("menus").doc(id).update({
      status: status,
      updatedAt: new Date(),
      pdfUrl,
    });
    return { success: true };
  } catch (err) {
    console.error("[publishMenu]", err);
    return { error: "Failed to publish menu" };
  }
}

"use server";

import { db } from "@/_lib/firebase-admin";
import { MenuData } from "./createMenu";

export async function getMenu(
  menuId: string
): Promise<{ data: MenuData | null } | { error: string }> {
  try {
    const docRef = db.collection("menus").doc(menuId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { data: null };
    }

    const plainData: MenuData = {
      ...(doc.data() as Omit<MenuData, "id" | "createdAt" | "updatedAt">),
      id: doc.id,
      createdAt: doc.data()?.createdAt?.toDate().toISOString() ?? null,
      updatedAt: doc.data()?.updatedAt?.toDate().toISOString() ?? null,
    };

    return { data: plainData };
  } catch (err) {
    console.error("[getMenu] Failed to fetch menu:", err);
    return { error: "Failed to fetch menu" };
  }
}

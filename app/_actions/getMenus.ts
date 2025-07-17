"use server";

import { db } from "@/_lib/firebase-admin";
import { MenuData } from "./createMenu";

/**
 * Returns all menus created by a specific user
 * with normalized `createdAt` (ISO string).
 */
export async function getMenusByUser(
  userId: string
): Promise<{ data: MenuData[] } | { error: string }> {
  try {
    const snapshot = await db
      .collection("menus")
      .where("userId", "==", userId)
      .get();

    const menus: MenuData[] = snapshot.docs.map((doc) => {
      const rawData = doc.data();

      const menu: MenuData = {
        ...(rawData as Omit<MenuData, "id" | "createdAt">),
        id: doc.id,
        createdAt:
          typeof rawData.createdAt?.toDate === "function"
            ? rawData.createdAt.toDate().toISOString()
            : null,
        updatedAt:
          typeof rawData.updatedAt?.toDate === "function"
            ? rawData.updatedAt.toDate().toISOString()
            : null,
      };

      return menu;
    });

    return { data: menus };
  } catch (error) {
    console.error("[getMenusByUser] Error:", error);
    return { error: "Failed to fetch menus" };
  }
}

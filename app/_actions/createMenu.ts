"use server";

import { db } from "@/_lib/firebase-admin";

export type MenuItem = {
  name: string;
  price: string;
};

export type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type MenuData = {
  id: string;
  logo: string | null;
  primaryColor: string;
  accentColor: string;
  status?: "public" | "private" | "archived";
  userId: string;
  createdAt?: number;
  updatedAt?: number;
  name?: string;
  categories?: Category[];
  pdfUrl?: string;
};

export async function createMenu(data: MenuData) {
  try {
    const ref = db.collection("menus").doc(data.id);
    await ref.set({
      logo: data.logo,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      userId: data.userId,
      createdAt: new Date(),
      name: data.name || null,
      categories: data.categories || null,
      status: data.status || "archived",
    });

    return { success: true };
  } catch (err) {
    console.error("[createMenu]", err);
    return { error: "Failed to create menu" };
  }
}

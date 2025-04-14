"use server";

import { cookies } from "next/headers";
import { encryptKey } from "@/lib/utils";

export async function setAdminAccess(passkey: string) {
  if (passkey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
    return { success: false, message: "Invalid passkey " };
  }

  const encryptedKey = encryptKey(passkey);
  const now = Date.now();

  cookies().set("accessKey", encryptedKey, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  cookies().set("accessKeyTime", now.toString(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}

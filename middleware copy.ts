import { NextRequest, NextResponse } from "next/server";
import { decryptKey } from "./lib/utils";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const accessKey = request.cookies.get("accessKey")?.value;
    const accessKeyTime = request.cookies.get("accessKeyTime")?.value;

    // If key or time is missing, redirect
    if (!accessKey || !accessKeyTime) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const decryptedKey = decryptKey(accessKey);
    const timeStored = parseInt(accessKeyTime, 10);
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();

    const validKey = decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    const notExpired = now - timeStored < oneHour;

    if (!validKey || !notExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("accessKey");
      response.cookies.delete("accessKeyTime");

      return response;
    }
  }

  return NextResponse.next();
}

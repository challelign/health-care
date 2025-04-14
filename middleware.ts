import { NextRequest, NextResponse } from "next/server";
import { decryptKey } from "./lib/utils";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  const accessKey = request.cookies.get("accessKey")?.value;
  const accessKeyTime = request.cookies.get("accessKeyTime")?.value;

  // Check if the user is requesting ?admin=true (any page)
  const isAdminTrigger = searchParams.has("admin");

  // Validate passkey cookies
  if (accessKey && accessKeyTime) {
    const decryptedKey = decryptKey(accessKey);
    const timeStored = parseInt(accessKeyTime, 10);
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();

    const validKey = decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    const notExpired = now - timeStored < oneHour;

    if (validKey && notExpired) {
      // ✅ If ?admin=true is in URL and key is valid, redirect to /admin
      if (isAdminTrigger && pathname !== "/admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // ✅ If already in /admin and everything is valid, continue
      return NextResponse.next();
    }
  }

  // If user is trying to access /admin without valid key, block
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("accessKey");
    response.cookies.delete("accessKeyTime");
    return response;
  }

  return NextResponse.next();
}

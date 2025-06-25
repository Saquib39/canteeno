import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // For session handling

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  // ✅ Protect /placeOrder and /my-orders (login required)
  if (path.startsWith("/placeOrder") || path.startsWith("/my-orders")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
// you can uncomment when you want that only admin can see admin pages
  // ✅ Protect /admin and /admin/* (admin only)
  // if (path.startsWith("/admin")) {
  //   if (!token || token.role !== "admin") {
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
  // }

  // ✅ Allow all other paths
  return NextResponse.next();
}

// ✅ Important: Add matcher so middleware applies to nested routes too
export const config = {
  matcher: [
    "/placeOrder",
    "/my-orders",
    "/admin/:path*",     // 🔒 protects /admin and all inside it
  ],
};

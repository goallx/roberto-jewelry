import { NextResponse, NextRequest } from "next/server";

const publicRoutes = [
  "/api/user/login",
  "/api/user/signup",
  "/",
  "/about-us",
  "/customize",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/profile")
  ) {
    const role = request.cookies.get("role")?.value;
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      console.log("No token found, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      console.log("User is not an admin, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    if (
      pathname.includes("login") ||
      pathname.includes("verify") ||
      pathname.includes("signup") ||
      pathname.includes("product") ||
      pathname === "/api/category" ||
      pathname === "/api/product/best-selling"
    ) {
      return NextResponse.next();
    }
    const cookies = request.headers.get("cookie");

    if (!cookies) {
      console.log("No cookies found, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    const token = cookies
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("No auth token found.");
    }

    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/user/verify`,
        {
          headers: {
            Cookie: `auth_token=${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const {
        user: { role, id: userId },
      } = await response.json();

      if (!userId || !role) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", userId);
      requestHeaders.set("x-user-role", role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log("Token verification failed, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/orders/:path*",
    "/payment",
    "/payment/:path*",
    "/profile",

    // backend routes
    "/api/:path*",
  ],
};

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// If Supabase is slow/unreachable (e.g. a paused free-tier project), don't
// let the whole site hang behind a MIDDLEWARE_INVOCATION_TIMEOUT. Real route
// protection happens server-side in app/(app)/layout.tsx, so it's safe to
// fail open here and just skip the session refresh for this request.
const AUTH_CHECK_TIMEOUT_MS = 3000;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Supabase auth check timed out")),
          AUTH_CHECK_TIMEOUT_MS,
        ),
      ),
    ]);
  } catch (error) {
    console.error("[proxy] Supabase session refresh failed or timed out:", error);
  }

  return supabaseResponse;
}

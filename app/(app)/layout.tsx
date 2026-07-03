import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppNav } from "@/components/AppNav";
import { AppFooter } from "@/components/AppFooter";
import { ToastFromQuery } from "@/components/ToastFromQuery";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="app-canvas flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
      <AppNav />
      <main id="main-content" className="app-main mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppNav } from "@/components/AppNav";
import { AppFooter } from "@/components/AppFooter";
import { ToastFromQuery } from "@/components/ToastFromQuery";
import { MeridianJourneyBar } from "@/components/MeridianJourneyBar";
import { MeridianTourGate } from "@/components/MeridianTourGate";

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
    <>
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
      <Suspense fallback={null}>
        <MeridianTourGate app="greenops" />
      </Suspense>
      <AppNav />
      <MeridianJourneyBar current="greenops" />
      <main id="main-content" className="app-main mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </>
  );
}

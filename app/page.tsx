import { auth0 } from "@/lib/auth0";
import LandingPage from "@/components/landing/landing-page";
import { redirect } from "next/navigation";

// If Geist Sans is not available, fallback to Inter or system-ui

// Use a more elegant, modern font stack
const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/home");
  }

  return (
    <main>
      <LandingPage />
    </main>
  );
}

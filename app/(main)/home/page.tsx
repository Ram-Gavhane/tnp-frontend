"use client";

import { useSession } from "@/providers/session-provider";
import LandingPage from "@/components/landing/landing-page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Home() {
  const session = useSession();
  const router = useRouter();

  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    if (!session) {
      setCheckingUser(false);
      return;
    }

    const checkUserFlow = async () => {
      try {
        const res = await fetch("/api/my-proxy/api/v1/user/me");

        if (!res.ok) {
          setCheckingUser(false);
          return;
        }

        const data = await res.json();

        const role = data.user.role;
        const step = data.user.onboardingStep;

        /* ---------------- STUDENT FLOW ---------------- */
        if (role === "STUDENT") {
          if (step !== "COMPLETED") {
            router.replace(`/student/onboarding/${step.toLowerCase()}`);
            return;
          }

          // onboarding done → student home
          router.replace("/student/home");
          return;
        }

        /* ---------------- ADMIN / TNP FLOW ---------------- */
        if (role === "ADMIN" || role === "TNP_OFFICER") {
          router.replace("/admin/dashboard");
          return;
        }

        setCheckingUser(false);
      } catch (err) {
        setCheckingUser(false);
      }
    };

    checkUserFlow();
  }, [session, router]);

  /* ---------------- LOADING ---------------- */
  if (session && checkingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Preparing your dashboard…
        </p>
      </div>
    );
  }

  /* ---------------- LOGGED OUT UI ---------------- */
  if (!session) {
    return (
      <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />

        <section className="mx-auto max-w-3xl px-6 text-center space-y-8">
          <p className="text-2xl mt-8 sm:text-3xl font-extrabold uppercase tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 animate-gradient-text">
            Centralised Placement System
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            One platform for students,
            <br />
            placement officers & recruiters
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground">
            Collect verified student data, manage eligibility automatically, and
            track placements without spreadsheets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/auth/login?screen_hint=signup"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get started
            </a>

            <a
              href="/auth/login"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              Login
            </a>
          </div>
        </section>

        {/* ---------------- COLLEGE INFORMATION ---------------- */}
        <section className="mx-auto mt-24 max-w-5xl px-6">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center">
              About Our College
            </h2>

            <p className="mt-4 text-center text-muted-foreground">
              <a
          href="https://moderncoe.edu.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-foreground underline-offset-4 hover:text-primary transition"
        >
          P.E.S. Modern College of Engineering, Pune 
        </a>

              is an autonomous engineering institute established in 1999 under
              Pune Education Society. The college is affiliated to Savitribai
              Phule Pune University and is known for academic excellence,
              industry-focused learning, and strong placement support.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">1999</p>
                <p className="text-sm text-muted-foreground">Established</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">Autonomous</p>
                <p className="text-sm text-muted-foreground">SPPU Affiliated</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">Pune</p>
                <p className="text-sm text-muted-foreground">Maharashtra</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">Engineering</p>
                <p className="text-sm text-muted-foreground">UG & PG Programs</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- COLLEGE ACHIEVEMENTS ---------------- */}
        <section className="mx-auto mt-8 max-w-5xl px-6 pb-6">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center">
              College Achievements
            </h2>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border p-4">
                🎓 Autonomous status granted for academic flexibility
              </li>

              <li className="rounded-lg border border-border p-4">
                💼 Strong placement record with top IT & core companies
              </li>

              <li className="rounded-lg border border-border p-4">
                🏆 Consistent university results and merit rank holders
              </li>

              <li className="rounded-lg border border-border p-4">
                🚀 Active technical clubs, hackathons & startup culture
              </li>

              <li className="rounded-lg border border-border p-4">
                🤝 Industry collaborations & internship opportunities
              </li>

              <li className="rounded-lg border border-border p-4">
                🌐 Alumni working in reputed MNCs worldwide
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------- TRAINING & PLACEMENT CELL ---------------- */}
        <section className="mx-auto mt-4 max-w-5xl px-6 pb-6">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center">
              Welcome to Training and Placement Cell
            </h2>
          <div className="mt-8 overflow-hidden">
          <div className="flex w-max gap-4 animate-scroll-horizontal">
            {/* SET 1 */}
            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102008_9e3fac24fa63c3a49365.png"
                alt="TNP Image 1"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102032_4baf47851998ace8ac6a.png"
                alt="TNP Image 2"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102053_c977819f5b6abbf14865.png"
                alt="TNP Image 3"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770269893_1514b69487af0a8ec79f.jpg"
                alt="TNP Image 4"
                fill
                className="object-cover"
              />
            </div>

            {/* DUPLICATE SET (for seamless loop) */}
            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102008_9e3fac24fa63c3a49365.png"
                alt="TNP Image 1 duplicate"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102032_4baf47851998ace8ac6a.png"
                alt="TNP Image 2 duplicate"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770102053_c977819f5b6abbf14865.png"
                alt="TNP Image 3 duplicate"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-56 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1770269893_1514b69487af0a8ec79f.jpg"
                alt="TNP Image 4 duplicate"
                fill
                className="object-cover"
              />
            </div>
            </div>
          </div>
          </div>
        </section>

        {/* ---------------- PLACED STUDENTS ---------------- */}
        <section className="mx-auto mt-12 max-w-5xl px-6 pb-24">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
              Our Placed Students
            </h2>

            <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] border-none">
              <Image
                src="https://webweb.ams3.cdn.digitaloceanspaces.com/data/modern-college-of-eng-pune.webweb.ai.in/1753872125_49aab90b70dba4920e0e.png"
                alt="Our Placed Students - Training and Placement Cell"
                fill
                className="object-contain bg-white"
              />
            </div>
          </div>
        </section>


        <footer className="absolute bottom-0 w-full border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Centralised Placement System
        </footer>
      </main>
    );
  }

  /* ---------------- FALLBACK (won’t render often) ---------------- */
  return <LandingPage />;
}

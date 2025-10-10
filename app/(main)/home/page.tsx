import Image from "next/image";
const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";
export default function Home() {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between bg-white dark:bg-black transition-colors duration-300 ${fontClass}`}
    >
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-20 gap-20">
        <div className="flex flex-col items-center gap-4 max-w-xl w-full">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Centralised Placement System Logo"
            width={80}
            height={28}
            priority
          />
          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black dark:text-white tracking-tight leading-snug">
            Centralised Placement System
          </h1>
          <p className="text-base sm:text-lg text-center text-zinc-600 dark:text-zinc-300 max-w-md font-normal leading-relaxed mt-2">
            Streamline your campus recruitment process with our all-in-one
            platform for students, companies, and placement coordinators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <a
            className="rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center justify-center bg-black text-white hover:bg-zinc-900 font-medium text-sm h-10 px-6 sm:w-auto"
            href="/auth/login"
          >
            Login
          </a>
        </div>

        <section
          id="features"
          className="mt-10 grid gap-8 sm:grid-cols-2 w-full max-w-2xl"
        >
          <div className="flex flex-col items-center gap-2">
            <Image src="/file.svg" alt="Student icon" width={28} height={28} />
            <h2 className="font-medium text-base mt-2 mb-1 text-black dark:text-white">
              For Students
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs">
              Browse job postings, apply easily, track your application status,
              and get notified about interviews and results.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/window.svg"
              alt="Company icon"
              width={28}
              height={28}
            />
            <h2 className="font-medium text-base mt-2 mb-1 text-black dark:text-white">
              For Companies
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs">
              Post job openings, manage candidate pipelines, and schedule
              interviews with ease.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/globe.svg"
              alt="Coordinator icon"
              width={28}
              height={28}
            />
            <h2 className="font-medium text-base mt-2 mb-1 text-black dark:text-white">
              For Coordinators
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs">
              Oversee the entire placement process, communicate with
              stakeholders, and generate insightful reports.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/next.svg" alt="Secure icon" width={28} height={28} />
            <h2 className="font-medium text-base mt-2 mb-1 text-black dark:text-white">
              Secure & Centralised
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs">
              All data is securely managed in one place, ensuring privacy and
              transparency for all users.
            </p>
          </div>
        </section>
      </main>
      <footer className="flex gap-4 flex-wrap items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs border-t border-zinc-100 dark:border-zinc-900 py-6 w-full font-normal tracking-wide">
        <span>© {new Date().getFullYear()} Centralised Placement System</span>
        <a
          className="hover:underline"
          href="mailto:support@placement-system.com"
        >
          Contact Support
        </a>
        <a className="hover:underline" href="#">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}

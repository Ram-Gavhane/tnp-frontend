"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AccessDenied = (props: Props) => {
  const router = useRouter();
  useEffect(() => {
    document.title = "Access Denied";

    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          className="pb-6"
          src="/not_allowed.png"
          height="100"
          width="100"
          alt="Access Denied"
        />
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Access Denied
        </h1>
        <p className="text-lg">You will be redirected shortly...</p>
        <p className="animate-pulse [animation-duration:0.9s] font-medium">
          Please Login using moderncoe.edu.in domain ONLY !!!!
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;

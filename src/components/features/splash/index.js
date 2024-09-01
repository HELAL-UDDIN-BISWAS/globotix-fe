"use client";
import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@/components/ui/images";
import useAuth from "@/hooks/useAuth";

const Splash = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { user } = useAuth();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (user) {
        startTransition(() => router.replace("/dashboard"));
      } else {
        startTransition(() => router.replace("/login"));
      }
    }, 2000);

    return () => clearTimeout(redirectTimeout);
  }, [router]);
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Image
        src={"/upload/images/logo_globotix.png"}
        width={300}
        height={300}
        alt="Logo Picture"
      />
    </div>
  );
};

export default Splash;

"use client";

import LoginForm from "@/components/auth/login-form";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLoginSuccess = () => {
    toast.success("Login successful");
    router.push("/home");
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-cscreen w-full flex flex-col items-center">
      <div className="flex flex-col h-cscreen w-full max-w-4xl justify-center items-center gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="-mt-24  md:max-w-2/5">
          <div className="flex w-full justify-center md:justify-start">
            <Image
              src="/ciscode-logo.png"
              alt="Ciscode Logo"
              width={500}
              height={500}
              className="h-12 w-auto md:-ml-1"
            />
          </div>
          <p className="font-normal text-center md:text-start text-xl">
            Code your problems away...
          </p>
        </div>
        <LoginForm handleSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

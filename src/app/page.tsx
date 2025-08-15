"use client"

import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLoginSuccess = () => {
    toast.success("Login successful");
    router.push("/home");
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-cscreen flex flex-col justify-center items-center gap-8 px-2 md:flex-row md:items-center md:justify-evenly">
      <div className="-mt-24  md:max-w-2/5">
        <h1 className="text-primary text-center md:text-start font-semibold text-6xl">ciscode</h1>
        <p className="font-normal text-center md:text-start text-xl">Code your problems away...</p>
      </div>

      <LoginForm handleSuccess={handleLoginSuccess}/> 
    </div>
  )
}

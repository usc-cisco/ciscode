"use client"

import LoginForm from "@/components/landing/login-form";
import SignupForm from "@/components/landing/signup-form";
import { useAuth } from "@/contexts/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSetSignup = () => {
    setIsLogin(false);
  }

  const handleSetLogin = () => {
    setIsLogin(true);
  }

  const handleLoginSuccess = () => {
    toast.success("Login successful");
    router.push("/home");
  }

  const handleSignupSuccess = () => {
    setIsLogin(true);
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4 items-center justify-evenly">
      <div className="-mt-24 max-w-2/5">
        <h1 className="text-primary font-semibold text-6xl">ciscode</h1>
        <p className="font-normal text-xl">Code your problems away...</p>
      </div>

      {
        isLogin 
        ? 
        <LoginForm onSetSignup={handleSetSignup} handleSuccess={handleLoginSuccess}/> 
        : 
        <SignupForm onSetLogin={handleSetLogin} handleSuccess={handleSignupSuccess}/>
      }
    </div>
  )
}

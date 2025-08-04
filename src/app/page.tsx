"use client"

import LoginForm from "@/components/landing/login-form";
import SignupForm from "@/components/landing/signup-form";
import { useAuth } from "@/contexts/auth.context";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  const handleSetSignup = () => {
    setIsLogin(false);
  }

  const handleSetLogin = () => {
    setIsLogin(true);
  }

  const handleLoginSuccess = () => {
    redirect("/");
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
      <div className="-mt-28 max-w-2/5">
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

"use client"

import LoginForm from "@/components/landing/login-form";
import SignupForm from "@/components/landing/signup-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleSetSignup = () => {
    setIsLogin(false);
  }

  const handleSetLogin = () => {
    setIsLogin(true);
  }

  const handleLoginSuccess = () => {
    router.push("/problem");
  }

  const handleSignupSuccess = () => {
    setIsLogin(true);
  }

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

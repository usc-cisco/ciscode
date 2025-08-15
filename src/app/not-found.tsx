"use client";

import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
      <p className="font-semibold text-lg">
        This page is under construction...
      </p>
      <Link
        className="rounded-lg bg-primary text-white px-6 py-2"
        href={isAuthenticated ? "/home" : "/"}
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;

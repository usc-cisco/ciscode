"use client";

import ProtectedRoute from "@/components/shared/protected-route";
import React from "react";
import ProblemContainer from "@/components/shared/problem-container";

export default function Home() {
  return (
    <ProtectedRoute>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">Practice Problems</h3>
            <p>Choose from our curated collection of coding challenges</p>
          </div>

          <ProblemContainer />
        </div>
      </section>
    </ProtectedRoute>
  );
}

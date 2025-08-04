"use client";

import ProtectedRoute from '@/components/shared/protected-route';
import { useAuth } from '@/contexts/auth.context';
import React, { useEffect } from 'react'

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-4rem)]">
      
      </div>
    </ProtectedRoute>
  )
}

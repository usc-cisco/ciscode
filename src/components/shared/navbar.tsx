"use client";

import React from 'react'
import { ThemeToggle } from './theme-toggle'
import Brand from './brand'
import { useAuth } from '@/contexts/auth.context';
import { LogOutIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';
import { Badge } from '../ui/badge';
import RoleEnum from '@/lib/types/enums/role.enum';

const Navbar = () => {
  const { isAuthenticated, clearAuth, userInfo } = useAuth();

  const { role } = userInfo;

  const handleLogout = () => {
    clearAuth();
    redirect('/auth');
  }

  return (
    <div className='w-full h-16 px-6 flex justify-between items-center bg-primary text-primary-foreground'>
      <Brand />
      <div className='flex items-center gap-4'>
        {
          isAuthenticated && role !== null && (
            <Badge onClick={role === RoleEnum.ADMIN ? () => redirect('/admin') : () => {}} variant={'default'} className='text-xs bg-primary-foreground text-primary rounded-xl cursor-pointer'>
              {role === RoleEnum.ADMIN ? 'ADMIN' : 'STUDENT'}
            </Badge>
          )
        }
        <ThemeToggle />
        {isAuthenticated && (
          <Button onClick={handleLogout} size="icon" className="bg-primary hover:bg-primary hover:brightness-80 ring-0 hover:ring-0 shadow-none text-primary-foreground hover:text-primary-foreground cursor-pointer">
            <LogOutIcon className='size-4'/>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Navbar

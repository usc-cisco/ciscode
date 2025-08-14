"use client";

import React from 'react'
import { ThemeToggle } from './theme-toggle'
import Brand from './brand'
import { useAuth } from '@/contexts/auth.context';
import { LogOutIcon, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import RoleEnum from '@/lib/types/enums/role.enum';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';

const Navbar = () => {
  const { isAuthenticated, clearAuth, userInfo, isAdmin } = useAuth();
  const router = useRouter();

  const { role } = userInfo;

  const handleLogout = () => {
    clearAuth();
    router.push('/auth');
  }

  return (
    <div className='w-full h-16 px-6 flex justify-between items-center bg-primary text-primary-foreground'>
      <Brand path={isAuthenticated ? "/home" : "/"}/>
      <div className='flex items-center gap-2'>
        {
          isAuthenticated && role !== null && (
            <Badge onClick={isAdmin ? () => router.push('/admin') : () => {}} variant={'default'} className={`text-xs bg-primary-foreground text-primary rounded-xl mx-1 ${isAdmin ? 'cursor-pointer' : 'pointer-events-none'}`}>
              {
                role === RoleEnum.USER ?
                "STUDENT"
                :
                role
              }
            </Badge>
          )
        }
        <ThemeToggle />
        {isAuthenticated && (
          // <Button onClick={handleLogout} size="icon" className="bg-primary hover:bg-primary hover:brightness-80 ring-0 hover:ring-0 shadow-none text-primary-foreground hover:text-primary-foreground cursor-pointer">
          //   <LogOutIcon className='size-4'/>
          // </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="bg-primary hover:bg-primary hover:brightness-80 ring-0 hover:ring-0 shadow-none text-primary-foreground hover:text-primary-foreground cursor-pointer">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-vscode-light dark:bg-vscode-dark text-sm' align="end">
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default Navbar

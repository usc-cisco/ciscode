import React from 'react'
import { ThemeToggle } from './theme-toggle'
import Brand from './brand'

const Navbar = () => {
  return (
    <div className='w-full h-16 px-6 flex justify-between items-center bg-primary text-primary-foreground'>
      <Brand />
      <ThemeToggle />
    </div>
  )
}

export default Navbar

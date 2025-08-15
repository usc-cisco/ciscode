import Link from 'next/link'
import React from 'react'

interface BrandProps {
  path: string;
}

const Brand = ({ path }: BrandProps) => {
  return (
    <>
      <Link href={path} className="hidden md:block mr-auto w-auto text-lg font-semibold text-white sm:text-xl">
          ciscode.dcism.org
      </Link>
      <Link href={path} className="md:hidden mr-auto w-auto text-lg font-semibold text-white sm:text-xl">
          ciscode
      </Link>
    </>
  )
}

export default Brand

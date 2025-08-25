import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BrandProps {
  path: string;
}

const Brand = ({ path }: BrandProps) => {
  return (
    <>
      <Link
        href={path}
        className="hidden sm:block mr-auto w-auto text-lg font-semibold text-white sm:text-xl"
      >
        ciscode.dcism.org
      </Link>
      <Link
        href={path}
        className="sm:hidden mr-auto w-auto text-lg font-semibold text-white sm:text-xl"
      >
        <Image
          src="/ciscode-logo-white.png"
          className="h-10 w-auto aspect-square"
          alt="Ciscode Logo"
          height={1000}
          width={1000}
        />
      </Link>
    </>
  );
};

export default Brand;

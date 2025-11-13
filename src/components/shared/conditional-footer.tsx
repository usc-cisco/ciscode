"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // hide footer on problem pages (as requested)
  if (pathname?.startsWith("/problem")) {
    return null;
  }

  return <Footer />;
}

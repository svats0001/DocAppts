'use client';

import { usePathname } from "next/navigation";
import Page from "./search/page";
import Search from "./search/search";
import { Suspense } from "react";

export default function Home() {
  const pathName = usePathname();

  return (
    <div key={pathName}>
      <Page></Page>
    </div>
  );
}
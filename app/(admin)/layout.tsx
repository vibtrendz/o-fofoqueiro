"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Example auth check
    const fakeUser = localStorage.getItem("user");
    if (!fakeUser) router.push("/login");
    else setUser(fakeUser);
  }, [router]);

  return (
    <div>
      <nav>
        <Link href="/admin/dashboard" className={pathname === "/admin/dashboard" ? "active" : ""}>
          Dashboard
        </Link>
        <Link href="/admin/posts" className={pathname?.startsWith("/admin/posts") ? "active" : ""}>
          Posts
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}

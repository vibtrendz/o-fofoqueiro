"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleGoHome}>Go Home</button>
      <Link href="/admin/posts">Manage Posts</Link>
    </div>
  );
}

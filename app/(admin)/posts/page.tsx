"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/models/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // fetch or load posts
    setPosts([
      /* example data */ { id: "1", title: "Hello World", content: "..." },
    ]);
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      <Link href="/admin/posts/new">Create New Post</Link>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/posts/${p.id}/edit`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

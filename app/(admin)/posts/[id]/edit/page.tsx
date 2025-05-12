"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { Post } from "@/models/post";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // load post by id
    if (id) {
      // fake fetch
      setPost({ id, title: "Sample", content: "..." });
    } else {
      notFound();
    }
  }, [id]);

  if (!post) return <p>Loading…</p>;

  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm initialData={post} />
    </div>
  );
}

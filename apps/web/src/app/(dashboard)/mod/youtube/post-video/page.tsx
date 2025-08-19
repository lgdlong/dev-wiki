import { Input } from "@/components/ui/input";
import React from "react";
import { PostVideoForm } from "./PostVideoForm";

export default function PostVideoPage() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-20">
      <PostVideoForm />
    </div>
  );
}

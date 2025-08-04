import React from "react";

export default function CategoryDetail({ slug }: { slug: string }) {
  return (
    <div>
      <h1 className="text-3xl">Slug: {slug}</h1>
    </div>
  );
}

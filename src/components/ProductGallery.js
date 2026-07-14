"use client";

import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const list = images?.length ? images : [""];

  return (
    <div>
      <div className="aspect-square bg-[var(--color-surfaceMuted)] rounded-[var(--radius-lg)] overflow-hidden mb-3">
        {list[active] && <img src={list[active]} alt={name} className="w-full h-full object-cover" />}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[var(--radius-md)] overflow-hidden border-2"
              style={{ borderColor: active === i ? "var(--color-accent)" : "transparent" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, type ReactNode } from "react";
import { reorderTasks } from "@/lib/actions";

// Wraps server-rendered task rows in drag handles. Children arrive in the
// same order as `ids`; on drop the new order is saved via reorderTasks and
// the local order is kept until the server refresh confirms it.
export function DraggableTaskList({
  ids,
  children,
}: {
  ids: string[];
  children: ReactNode[];
}) {
  const [order, setOrder] = useState<number[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Reset optimistic order when the server sends a new list.
  const key = ids.join(",");
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setOrder(null);
  }

  const current = order ?? ids.map((_, i) => i);

  function handleDrop(targetPos: number) {
    if (dragIndex === null) return;
    const fromPos = current.indexOf(dragIndex);
    if (fromPos === -1 || fromPos === targetPos) return;
    const next = [...current];
    next.splice(fromPos, 1);
    next.splice(targetPos, 0, dragIndex);
    setOrder(next);
    setDragIndex(null);
    void reorderTasks(next.map((i) => ids[i]));
  }

  return (
    <div>
      {current.map((childIndex, pos) => (
        <div
          key={ids[childIndex]}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(pos);
          }}
          className="flex items-start gap-1"
        >
          <span
            draggable
            onDragStart={() => setDragIndex(childIndex)}
            onDragEnd={() => setDragIndex(null)}
            title="Drag to reorder"
            className="mt-3.5 cursor-grab select-none text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
            aria-hidden
          >
            ⠿
          </span>
          <div className="min-w-0 flex-1">{children[childIndex]}</div>
        </div>
      ))}
    </div>
  );
}

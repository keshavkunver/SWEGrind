"use client";

import { useState, type ReactNode } from "react";
import { reorderTasks } from "@/lib/actions";

// Wraps server-rendered task rows in reorder handles. Children arrive in
// the same order as `ids`; on drop (or Arrow key move) the new order is
// saved via reorderTasks and kept locally until the server refresh
// confirms it. The handle is focusable: ArrowUp/ArrowDown move the row for
// keyboard users.
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

  function moveTo(childIndex: number, targetPos: number) {
    const fromPos = current.indexOf(childIndex);
    if (fromPos === -1 || targetPos < 0 || targetPos >= current.length) return;
    if (fromPos === targetPos) return;
    const next = [...current];
    next.splice(fromPos, 1);
    next.splice(targetPos, 0, childIndex);
    setOrder(next);
    void reorderTasks(next.map((i) => ids[i]));
  }

  return (
    <div className={dragIndex !== null ? "select-none" : undefined}>
      {current.map((childIndex, pos) => (
        <div
          key={ids[childIndex]}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null) moveTo(dragIndex, pos);
            setDragIndex(null);
          }}
          className="flex items-start gap-1"
        >
          <span
            role="button"
            tabIndex={0}
            draggable
            aria-label="Reorder task: drag, or press arrow up or down"
            onDragStart={() => setDragIndex(childIndex)}
            onDragEnd={() => setDragIndex(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                moveTo(childIndex, pos + (e.key === "ArrowUp" ? -1 : 1));
              }
            }}
            title="Drag to reorder (or arrow keys)"
            className="mt-3.5 cursor-grab select-none rounded text-zinc-300 hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500 active:cursor-grabbing"
          >
            ⠿
          </span>
          <div className="min-w-0 flex-1">{children[childIndex]}</div>
        </div>
      ))}
    </div>
  );
}

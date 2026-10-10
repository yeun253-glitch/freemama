"use client";

import { useEffect, useState } from "react";
import { newId, store, type BucketItem } from "@/lib/storage";

const EXAMPLES = ["향수 만들기", "혼자 영화", "한강 피크닉", "도예 클래스"];

export default function BucketPage() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [text, setText] = useState("");

  useEffect(() => setItems(store.bucket()), []);

  function update(next: BucketItem[]) {
    setItems(next);
    store.setBucket(next);
  }

  function add(value: string) {
    const v = value.trim();
    if (!v) return;
    update([{ id: newId(), text: v, done: false, createdAt: new Date().toISOString() }, ...items]);
    setText("");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">버킷리스트</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(text);
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="해보고 싶은 거"
          maxLength={100}
          className="flex-1 rounded-2xl bg-card px-4 py-3.5 outline-none focus:ring-2 focus:ring-accent"
        />
        <button type="submit" className="rounded-2xl bg-accent px-5 font-semibold text-white">
          추가
        </button>
      </form>

      {items.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => add(ex)}
              className="rounded-full bg-card px-3 py-2 text-sm text-muted"
            >
              + {ex}
            </button>
          ))}
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => update(items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))}
              className="h-4 w-4 accent-[var(--accent)]"
              aria-label="해냈어요"
            />
            <span className={`flex-1 text-sm ${item.done ? "text-muted line-through" : ""}`}>{item.text}</span>
            <button
              type="button"
              onClick={() => update(items.filter((i) => i.id !== item.id))}
              className="text-xs text-muted"
              aria-label="삭제"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { newId, store, type BucketItem } from "@/lib/storage";

const EXAMPLES = ["향수 만들기 원데이 클래스", "혼자 심야 영화 보기", "한강 피크닉", "북카페에서 책 한 권 끝내기"];

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
      <header>
        <h1 className="text-2xl font-bold">자유부인 버킷리스트</h1>
        <p className="mt-1 text-sm text-muted">
          평소에 &lsquo;나중에 꼭 해봐야지&rsquo; 했던 걸 적어 두세요. 자유 시간이 생기면 코스에 섞어 드려요.
        </p>
      </header>

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
          placeholder="하고 싶은 것 한 줄"
          maxLength={100}
          className="flex-1 rounded-xl border border-line bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-xl bg-accent px-4 text-sm font-semibold text-white">
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
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted"
            >
              + {ex}
            </button>
          ))}
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-3">
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

"use client";

import { useOptimistic, useTransition } from "react";
import { setCollabVisible, setProjectPublished } from "@/app/admin/actions";

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: [string, string] }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-2 text-[12px] text-ink-soft" aria-pressed={on}>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-mint-deep" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
      {on ? label[0] : label[1]}
    </button>
  );
}

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [, start] = useTransition();
  const [on, set] = useOptimistic(published);
  return (
    <Switch
      on={on}
      label={["Live on site", "Hidden"]}
      onToggle={() => start(async () => { set(!on); await setProjectPublished(id, !on); })}
    />
  );
}

export function VisibleToggle({ id, visible }: { id: string; visible: boolean }) {
  const [, start] = useTransition();
  const [on, set] = useOptimistic(visible);
  return (
    <Switch
      on={on}
      label={["On site", "Hidden"]}
      onToggle={() => start(async () => { set(!on); await setCollabVisible(id, !on); })}
    />
  );
}

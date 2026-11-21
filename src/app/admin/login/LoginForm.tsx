"use client";

import { useActionState } from "react";
import { signIn } from "../actions";
import { Field, inputCls, SubmitButton } from "@/components/admin/Fields";

export function LoginForm() {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
      {state?.error && <p className="text-[13px] text-rose">{state.error}</p>}
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}

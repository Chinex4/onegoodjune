"use client";
import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { login } from "./actions";
import { buttonStyles } from "@/components/site/primitives";
export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-10 space-y-5">
      <div>
        <label
          htmlFor="password"
          className="font-sans text-[0.8125rem] font-medium"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!state?.error}
          aria-describedby={state?.error ? "password-error" : undefined}
          className="mt-2 block min-h-12 w-full border border-ink/25 bg-white px-4 font-sans text-base focus:border-forest focus:outline-2 focus:outline-forest"
        />
        {state?.error && (
          <p
            id="password-error"
            role="alert"
            className="mt-2 flex items-center gap-2 font-sans text-[0.8125rem] text-rust"
          >
            <CircleAlert size={15} aria-hidden="true" />
            {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles("ink", "w-full")}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { ArrowIcon, buttonStyles } from "./primitives";
const fieldClass =
  "mt-2 block min-h-12 w-full border border-ink/25 bg-white px-4 font-serif text-lg text-ink focus:border-forest focus:outline-2 focus:outline-forest aria-invalid:border-rust";
type Field = "name" | "email" | "answer";
export function EventForm({
  event,
  question,
}: {
  event: string;
  question?: string;
}) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setErrors({});
    setResult(undefined);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          event,
        }),
      });
      const body = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      setErrors(
        Object.fromEntries(
          Object.entries(body.errors ?? {}).map(([k, v]) => [k, v[0]]),
        ),
      );
      setResult({
        ok: response.ok,
        message: body.message || "Something went wrong. Please try again.",
      });
      if (response.ok) form.reset();
    } catch {
      setResult({
        ok: false,
        message:
          "We couldn't reach the server. Check your connection and try again.",
      });
    }
    setBusy(false);
  }
  const field = (
    name: Field,
    text: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label
        htmlFor={`event-${name}`}
        className="font-sans text-[0.8125rem] font-medium"
      >
        {text}
      </label>
      <input
        id={`event-${name}`}
        name={name}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `event-${name}-error` : undefined}
        className={fieldClass}
        {...props}
      />
      {errors[name] && (
        <p
          id={`event-${name}-error`}
          className="mt-2 flex items-center gap-2 font-sans text-[0.8125rem] text-rust"
        >
          <CircleAlert size={15} aria-hidden="true" className="shrink-0" />
          {errors[name]}
        </p>
      )}
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {field("name", "Name", {
        required: true,
        autoComplete: "name",
        maxLength: 120,
      })}
      {field("email", "Email", {
        required: true,
        type: "email",
        inputMode: "email",
        autoComplete: "email",
        maxLength: 254,
      })}
      {question && field("answer", question, { maxLength: 300 })}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="event-website">Leave this field empty</label>
        <input
          id="event-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className={buttonStyles("ink", "w-full")}
      >
        {busy ? "Registering…" : "Register"}
        <ArrowIcon />
      </button>
      <div aria-live="polite">
        {result && (
          <p
            role={result.ok ? "status" : "alert"}
            className={`flex items-start gap-3 p-4 font-serif text-lg leading-snug ${result.ok ? "bg-lime/40 text-forest" : "bg-rust/10 text-rust"}`}
          >
            {result.ok ? (
              <CircleCheck
                size={20}
                aria-hidden="true"
                className="mt-1 shrink-0"
              />
            ) : (
              <CircleAlert
                size={20}
                aria-hidden="true"
                className="mt-1 shrink-0"
              />
            )}
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}

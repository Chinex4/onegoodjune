"use client";
import { useEffect, useRef, useState } from "react";
import { CircleAlert, Lock, X } from "lucide-react";
import {
  ArrowIcon,
  buttonStyles,
  label,
  type ButtonVariant,
} from "./primitives";
import { cn } from "@/lib/utils";
const OPEN_EVENT = "ogj:enroll";
type Option = { id: string; name: string; price: string; period: string };
// Any button on the page opens the one dialog, optionally preselecting a plan.
export function EnrollButton({
  program,
  variant = "lime",
  className = "",
  children,
}: {
  program?: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: program }))
      }
      className={buttonStyles(variant, className)}
    >
      {children}
      <ArrowIcon />
    </button>
  );
}
const fieldClass =
  "mt-2 block min-h-12 w-full border border-ink/25 bg-white px-4 font-serif text-lg text-ink placeholder:text-ink/40 focus:border-forest focus:outline-2 focus:outline-forest aria-invalid:border-rust";
type FieldName = "name" | "email" | "phone" | "bookTitle" | "releaseDate";
type Errors = Partial<Record<FieldName | "program", string>>;
export function EnrollDialog({
  title,
  options,
  defaultOption,
  eyebrow = "Get instant access",
  optionLegend = "Choose your plan",
  askBook = false,
}: {
  title: string;
  options: Option[];
  defaultOption: string;
  eyebrow?: string;
  optionLegend?: string;
  // Launch Spotlight: also collect the book's title and release date.
  askBook?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(defaultOption);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const open = (event: Event) => {
      const program = (event as CustomEvent<string | undefined>).detail;
      if (program) setSelected(program);
      setMessage("");
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, program: selected }),
      });
      const result = (await response.json()) as {
        authorizationUrl?: string;
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (response.ok && result.authorizationUrl) {
        window.location.assign(result.authorizationUrl);
        return;
      }
      setErrors(
        Object.fromEntries(
          Object.entries(result.errors ?? {}).map(([k, v]) => [k, v[0]]),
        ),
      );
      setMessage(result.message || "Something went wrong. Please try again.");
    } catch {
      setMessage(
        "We couldn't reach the server. Check your connection and try again.",
      );
    }
    setBusy(false);
  }
  const chosen = options.find((o) => o.id === selected) ?? options[0];
  const field = (
    name: FieldName,
    text: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label
        htmlFor={`enroll-${name}`}
        className="font-sans text-[0.8125rem] font-medium"
      >
        {text}
      </label>
      <input
        id={`enroll-${name}`}
        name={name}
        required={props.required ?? true}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `enroll-${name}-error` : undefined}
        className={fieldClass}
        {...props}
      />
      {errors[name] && (
        <p
          id={`enroll-${name}-error`}
          className="mt-2 flex items-center gap-2 font-sans text-[0.8125rem] text-rust"
        >
          <CircleAlert size={15} aria-hidden="true" className="shrink-0" />
          {errors[name]}
        </p>
      )}
    </div>
  );
  return (
    <dialog
      ref={dialog}
      aria-labelledby="enroll-title"
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto bg-white p-0 text-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 bg-black px-6 py-5 text-white sm:px-8">
        <div>
          <p className={cn(label, "text-lime")}>{eyebrow}</p>
          <h2
            id="enroll-title"
            className="mt-2 font-heading text-[1.5rem] leading-tight tracking-[-0.015em]"
          >
            {title}
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
          className="-mr-2 grid size-11 shrink-0 place-items-center [--focus-ring:var(--color-lime)] hover:text-lime"
        >
          <X size={22} />
        </button>
      </div>
      <form
        onSubmit={submit}
        noValidate
        className="space-y-5 px-6 py-6 sm:px-8 sm:py-7"
      >
        {options.length > 1 && (
          <fieldset>
            <legend className="font-sans text-[0.8125rem] font-medium">
              {optionLegend}
            </legend>
            <div className="mt-2 grid gap-2">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center justify-between gap-4 border border-ink/20 px-4 py-3 has-checked:border-ink has-checked:bg-lime/40 has-focus-visible:outline-2 has-focus-visible:outline-forest"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => setSelected(option.id)}
                      className="size-4 accent-forest"
                    />
                    <span className="font-sans text-sm font-semibold">
                      {option.name.split(" — ").at(-1)}
                    </span>
                  </span>
                  <span className="text-right font-sans text-[0.8125rem]">
                    {option.price}
                    <span className="block text-[0.75rem] text-ink/70">
                      {option.period}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {field("name", "Full name", { autoComplete: "name", maxLength: 120 })}
        {field("email", "Email", {
          type: "email",
          inputMode: "email",
          autoComplete: "email",
          maxLength: 254,
        })}
        {field("phone", "Phone number", {
          type: "tel",
          inputMode: "tel",
          autoComplete: "tel",
          placeholder: "+234 801 234 5678",
          maxLength: 20,
        })}
        {askBook && (
          <>
            {field("bookTitle", "Book title", { maxLength: 200 })}
            {field("releaseDate", "Release date (or date published)", {
              type: "date",
              required: false,
            })}
          </>
        )}
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="enroll-website">Leave this field empty</label>
          <input
            id="enroll-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div aria-live="polite">
          {message && (
            <p
              role="alert"
              className="flex items-start gap-2 bg-rust/10 p-3 font-sans text-sm text-rust"
            >
              <CircleAlert
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              {message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={busy}
          className={buttonStyles("ink", "w-full")}
        >
          {busy
            ? "Taking you to payment…"
            : `Continue to payment · ${chosen.price}`}
          <Lock size={16} aria-hidden="true" />
        </button>
        <p className="font-sans text-[0.75rem] leading-relaxed text-ink/65">
          Payments are processed securely by Paystack. By continuing you agree
          to our{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            className="underline underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </dialog>
  );
}

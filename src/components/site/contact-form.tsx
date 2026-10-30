"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  inquiryTypes,
  type ContactInput,
} from "@/lib/contact-schema";
import { ArrowUpRight, CircleAlert, CircleCheck } from "lucide-react";
import { ArrowIcon, buttonStyles } from "./primitives";
const fieldClass =
  "mt-2 block min-h-13 w-full rounded-none border border-ink/25 bg-white px-4 py-3 font-serif text-xl text-ink transition-colors placeholder:text-ink/40 hover:border-ink/50 focus:border-forest focus:outline-2 focus:outline-offset-0 focus:outline-forest aria-invalid:border-rust";
const labelClass = "font-sans text-[0.8125rem] font-medium text-ink";
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-2 flex items-center gap-2 font-sans text-[0.8125rem] text-rust"
    >
      <CircleAlert size={15} aria-hidden="true" className="shrink-0" />
      {message}
    </p>
  );
}
export function ContactForm() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      website: "",
    },
  });
  const submit = handleSubmit(async (values) => {
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (!response.ok) {
        if (result.errors)
          for (const [field, messages] of Object.entries(result.errors)) {
            if (
              [
                "firstName",
                "lastName",
                "email",
                "inquiryType",
                "message",
              ].includes(field)
            )
              setError(field as keyof ContactInput, { message: messages[0] });
          }
        setFeedback({
          type: "error",
          message:
            result.message ||
            "We couldn't send your message. Please try again.",
        });
        return;
      }
      reset();
      setFeedback({
        type: "success",
        message: result.message || "Your message has been sent.",
      });
    } catch {
      setFeedback({
        type: "error",
        message:
          "We couldn't reach the server. Check your connection and try again.",
      });
    }
  });
  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-7"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
        {(
          [
            {
              name: "firstName",
              label: "First Name",
              autoComplete: "given-name",
            },
            {
              name: "lastName",
              label: "Last Name",
              autoComplete: "family-name",
            },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
            </label>
            <input
              id={field.name}
              autoComplete={field.autoComplete}
              {...register(field.name)}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
              maxLength={80}
              required
              className={fieldClass}
            />
            <FieldError
              id={`${field.name}-error`}
              message={errors[field.name]?.message}
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...register("email")}
          maxLength={254}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <fieldset
        aria-invalid={!!errors.inquiryType}
        aria-describedby={errors.inquiryType ? "inquiry-error" : undefined}
      >
        <legend className={labelClass}>What are you enquiring about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {inquiryTypes.map((type) => (
            <label key={type} className="relative">
              <input
                type="radio"
                value={type}
                {...register("inquiryType")}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 cursor-pointer items-center border border-ink/25 bg-white px-5 font-sans text-sm font-medium transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest">
                {type}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="inquiry-error" message={errors.inquiryType?.message} />
      </fieldset>
      <div>
        <label htmlFor="message" className={labelClass}>
          Please leave your message here
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          required
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y leading-relaxed`}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-5 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs font-sans text-[0.8125rem] leading-relaxed text-ink/70">
          Please read our{" "}
          <a
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-forest"
          >
            Privacy Policy
          </a>{" "}
          before sharing your information.
        </p>
        <button
          disabled={isSubmitting}
          type="submit"
          className={buttonStyles("ink", "gap-12 sm:min-w-44")}
        >
          {isSubmitting ? "Sending…" : "Submit"}
          <ArrowIcon Icon={ArrowUpRight} />
        </button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 p-4 font-serif text-lg leading-relaxed ${feedback.type === "error" ? "bg-rust/10 text-rust" : "bg-lime/30 text-forest"}`}
          >
            {feedback.type === "error" ? (
              <CircleAlert
                size={20}
                aria-hidden="true"
                className="mt-1 shrink-0"
              />
            ) : (
              <CircleCheck
                size={20}
                aria-hidden="true"
                className="mt-1 shrink-0"
              />
            )}
            {feedback.message}
          </p>
        )}
      </div>
    </form>
  );
}

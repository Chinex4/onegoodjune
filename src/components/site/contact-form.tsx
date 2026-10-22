"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  inquiryTypes,
  type ContactInput,
} from "@/lib/contact-schema";
import { ArrowUpRight } from "lucide-react";
const fieldClass =
  "mt-3 min-h-12 w-full rounded-none border-b border-ink/40 bg-transparent px-0 py-3 font-serif text-xl transition-colors placeholder:text-ink/45 focus:border-forest focus:outline-2 focus:outline-offset-4 focus:outline-forest aria-invalid:border-rust";
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
      className="space-y-9"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-9 sm:grid-cols-2">
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
            <label htmlFor={field.name} className="font-sans text-xs">
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
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className="mt-3 font-sans text-xs text-rust"
              >
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="email" className="font-sans text-xs">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          maxLength={254}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="email-error" className="mt-3 font-sans text-xs text-rust">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="inquiryType" className="font-sans text-xs">
          What are you enquiring about?
        </label>
        <select
          id="inquiryType"
          {...register("inquiryType")}
          required
          aria-invalid={!!errors.inquiryType}
          aria-describedby={errors.inquiryType ? "inquiry-error" : undefined}
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Select an inquiry type
          </option>
          {inquiryTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        {errors.inquiryType && (
          <p id="inquiry-error" className="mt-3 font-sans text-xs text-rust">
            {errors.inquiryType.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="font-sans text-xs">
          Please leave your message here
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          required
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p id="message-error" className="mt-3 font-sans text-xs text-rust">
            {errors.message.message}
          </p>
        )}
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
      <p className="font-sans text-xs leading-relaxed text-ink/70">
        Please read our{" "}
        <a href="/privacy-policy" className="underline underline-offset-4">
          Privacy Policy
        </a>{" "}
        before sharing your information.
      </p>
      <button
        disabled={isSubmitting}
        type="submit"
        className="group inline-flex min-h-12 items-center gap-12 bg-ink px-6 py-4 font-sans text-xs text-white transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Submit"}
        <ArrowUpRight
          size={18}
          className="transition-transform motion-safe:group-hover:-translate-y-1"
        />
      </button>
      <div aria-live="polite" aria-atomic="true">
        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`border-l-2 py-2 pl-4 text-lg leading-relaxed ${feedback.type === "error" ? "border-rust text-rust" : "border-forest text-forest"}`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </form>
  );
}

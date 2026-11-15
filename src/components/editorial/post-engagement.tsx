"use client";
import { useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Heart, MessageCircle } from "lucide-react";
import { ArrowIcon, buttonStyles, subheading } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
type Comment = { id: string; name: string; body: string; createdAt: string };
type State = { likes: number; liked: boolean; comments: Comment[] };
type Field = "name" | "body";
const fieldClass =
  "mt-2 block w-full border border-ink/25 bg-white px-4 font-serif text-lg text-ink focus:border-forest focus:outline-2 focus:outline-forest aria-invalid:border-rust";
const NAME_KEY = "ogj:commenter-name";
const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});
const count = (n: number, one: string, many: string) =>
  `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
export function PostEngagement({ slug, title }: { slug: string; title: string }) {
  const base = `/api/pubs/${slug}`;
  const [state, setState] = useState<State>();
  const [unavailable, setUnavailable] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likeError, setLikeError] = useState<string>();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [busy, setBusy] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      // Prefill the name this browser used last time.
      const saved = localStorage.getItem(NAME_KEY);
      if (saved && nameField.current && !nameField.current.value)
        nameField.current.value = saved;
    } catch {}
    let live = true;
    fetch(`${base}/engagement`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<State>) : Promise.reject()))
      .then((data) => live && setState(data))
      .catch(() => live && setUnavailable(true));
    return () => {
      live = false;
    };
  }, [base]);
  async function toggleLike() {
    if (!state || liking) return;
    const next = !state.liked;
    const previous = state;
    setLiking(true);
    setLikeError(undefined);
    setState({ ...state, liked: next, likes: Math.max(0, state.likes + (next ? 1 : -1)) });
    try {
      const response = await fetch(`${base}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: next }),
      });
      const body = (await response.json()) as { likes?: number; liked?: boolean; message?: string };
      if (!response.ok || typeof body.likes !== "number") throw new Error(body.message);
      setState((s) => s && { ...s, likes: body.likes!, liked: !!body.liked });
    } catch (error) {
      setState(previous);
      setLikeError(
        (error instanceof Error && error.message) || "We couldn't save your like. Please try again.",
      );
    }
    setLiking(false);
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    setErrors({});
    setResult(undefined);
    try {
      const response = await fetch(`${base}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json()) as {
        message?: string;
        comment?: Comment;
        errors?: Record<string, string[]>;
      };
      setErrors(Object.fromEntries(Object.entries(body.errors ?? {}).map(([k, v]) => [k, v[0]])));
      if (response.ok) {
        if (body.comment) {
          const comment = body.comment;
          setState((s) => s && { ...s, comments: [...s.comments, comment] });
        }
        try {
          localStorage.setItem(NAME_KEY, String(data.name || ""));
        } catch {}
        (form.elements.namedItem("body") as HTMLTextAreaElement).value = "";
        setResult({ ok: true, message: "Thank you. Your comment is posted." });
      } else {
        setResult({ ok: false, message: body.message || "Something went wrong. Please try again." });
      }
    } catch {
      setResult({
        ok: false,
        message: "We couldn't reach the server. Check your connection and try again.",
      });
    }
    setBusy(false);
  }
  const error = (field: Field) =>
    errors[field] && (
      <p
        id={`comment-${field}-error`}
        className="mt-2 flex items-center gap-2 font-sans text-[0.8125rem] text-rust"
      >
        <CircleAlert size={15} aria-hidden="true" className="shrink-0" />
        {errors[field]}
      </p>
    );
  if (unavailable) return null;
  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="mx-auto max-w-[720px] scroll-mt-24 border-t border-ink/20 pb-14 pt-8"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={toggleLike}
          disabled={!state || liking}
          aria-pressed={state?.liked ?? false}
          aria-label={
            state
              ? `${state.liked ? "Unlike" : "Like"} “${title}”. ${count(state.likes, "like", "likes")}`
              : "Like"
          }
          className={cn(
            "group inline-flex min-h-11 items-center gap-2.5 border px-4 font-sans text-[0.875rem] font-semibold transition-colors disabled:cursor-wait",
            state?.liked
              ? "border-rust bg-rust/10 text-rust"
              : "border-ink/25 text-ink hover:border-rust hover:text-rust",
          )}
        >
          <Heart
            size={18}
            aria-hidden="true"
            className={cn("transition-transform group-active:scale-90", state?.liked && "fill-current")}
          />
          {state ? (
            <span aria-hidden="true">{count(state.likes, "like", "likes")}</span>
          ) : (
            <span aria-hidden="true" className="shimmer inline-block h-3 w-12" />
          )}
        </button>
        <a
          href="#comment-body"
          className="inline-flex min-h-11 items-center gap-2.5 font-sans text-[0.875rem] font-semibold text-ink/80 hover:text-forest"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {state ? count(state.comments.length, "comment", "comments") : "Comments"}
        </a>
      </div>
      <p aria-live="polite" className="font-sans text-[0.8125rem] text-rust empty:hidden">
        {likeError}
      </p>
      <h2 id="comments-heading" className={cn(subheading, "mt-10")}>
        Comments
      </h2>
      {!state ? (
        <div className="mt-6 space-y-6" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="shimmer h-3 w-32" />
              <div className="shimmer mt-3 h-3.5 w-full" />
              <div className="shimmer mt-2 h-3.5 w-4/5" />
            </div>
          ))}
        </div>
      ) : state.comments.length ? (
        <ol className="mt-6 divide-y divide-ink/10">
          {state.comments.map((comment) => (
            <li key={comment.id} className="py-5 first:pt-0">
              <p className="font-sans text-[0.875rem]">
                <span className="font-semibold">{comment.name}</span>
                <span className="text-ink/60">
                  {" · "}
                  <time dateTime={comment.createdAt}>
                    {dateFormat.format(new Date(comment.createdAt))}
                  </time>
                </span>
              </p>
              <p className="mt-2 whitespace-pre-line break-words font-serif text-lg leading-[1.45]">
                {comment.body}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 font-serif text-lg text-ink/70">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}
      <form onSubmit={submit} noValidate className="mt-8 space-y-5 bg-paper p-5 md:p-6">
        <p className="font-sans text-[0.9375rem] font-semibold">Leave a comment</p>
        <div>
          <label htmlFor="comment-name" className="font-sans text-[0.8125rem] font-medium">
            Name
          </label>
          <input
            id="comment-name"
            name="name"
            required
            autoComplete="name"
            maxLength={60}
            ref={nameField}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "comment-name-error" : undefined}
            className={cn(fieldClass, "min-h-12")}
          />
          {error("name")}
        </div>
        <div>
          <label htmlFor="comment-body" className="font-sans text-[0.8125rem] font-medium">
            Comment
          </label>
          <textarea
            id="comment-body"
            name="body"
            required
            rows={4}
            maxLength={1500}
            aria-invalid={!!errors.body}
            aria-describedby={errors.body ? "comment-body-error" : "comment-note"}
            className={cn(fieldClass, "py-3")}
          />
          {error("body")}
          <p id="comment-note" className="mt-2 font-sans text-[0.75rem] text-ink/65">
            Your name is shown with your comment. Please keep it kind.
          </p>
        </div>
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor="comment-website">Leave this field empty</label>
          <input id="comment-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" disabled={busy || !state} className={buttonStyles("ink")}>
          {busy ? "Posting…" : "Post comment"}
          <ArrowIcon />
        </button>
        <div aria-live="polite">
          {result && (
            <p
              role={result.ok ? "status" : "alert"}
              className={`flex items-start gap-3 p-4 font-serif text-lg leading-snug ${result.ok ? "bg-lime/40 text-forest" : "bg-rust/10 text-rust"}`}
            >
              {result.ok ? (
                <CircleCheck size={20} aria-hidden="true" className="mt-1 shrink-0" />
              ) : (
                <CircleAlert size={20} aria-hidden="true" className="mt-1 shrink-0" />
              )}
              {result.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

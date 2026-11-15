"use client";
// A submit button that asks before an action that can't be undone.
export function ConfirmButton({
  message,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { message: string }) {
  return (
    <button
      {...props}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

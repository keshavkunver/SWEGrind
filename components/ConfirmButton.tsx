"use client";

// Submit button for destructive form actions: asks for confirmation before
// letting the form action fire.
export function ConfirmButton({
  action,
  message,
  className,
  children,
  ...rest
}: {
  action: (fd: FormData) => void | Promise<void>;
  message: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      formAction={action}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}

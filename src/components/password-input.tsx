"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export function PasswordInput({
  type,
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : type}
        className={cn("pr-9", className)}
        autoComplete="new-password"
        disabled={disabled}
        autoCorrect="off"
        spellCheck="false"
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShow(!show)}
        className="absolute size-7 right-1 flex items-center justify-center rounded-sm top-1/2 transform -translate-y-1/2 [&>svg]:size-4 [&>svg]:text-muted-foreground hover:[&>svg]:text-foreground disabled:opacity-50"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

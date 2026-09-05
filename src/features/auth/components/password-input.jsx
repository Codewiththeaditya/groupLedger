"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import AuthInput from "./auth-input";

export default function PasswordInput({ id, name, label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInput
      id={id}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      error={error}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? ( <EyeOff className="h-4 w-4" /> ) : ( <Eye className="h-4 w-4" /> )}
        </button>
      }
      {...props}
    />
  );
}
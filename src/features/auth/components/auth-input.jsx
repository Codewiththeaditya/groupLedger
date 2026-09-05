import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthInput({ id, name, label, labelClassName, type = "text", error, className, rightElement, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={labelClassName}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          className={cn(rightElement && "pr-10", className) || "outline-none border  h-10 rounded-lg mt-1 p-2 box-border box-sizing"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && ( <p id={`${id}-error`} className="text-sm text-destructive" > {error} </p> )}
    </div>
  );
}
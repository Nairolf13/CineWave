import React from "react";
import { cn } from "../../utils/cn";

// Fonction utilitaire pour combiner les noms de classe
export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90",
    destructive: "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90",
    outline: "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-slate-900 underline-offset-4 hover:underline"
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button as default };

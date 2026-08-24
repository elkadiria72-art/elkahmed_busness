import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-700 focus-visible:outline-primary",
  secondary:
    "bg-accent text-accent-950 font-semibold shadow-sm hover:bg-accent-400 focus-visible:outline-accent",
  ghost:
    "border border-neutral-300 bg-transparent text-neutral-800 hover:border-primary hover:text-primary focus-visible:outline-neutral-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

export type ButtonProps = BaseProps &
  (
    | ({ href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof BaseProps
      >)
    | ({ href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof BaseProps
      >)
  );

function buildClasses(variant: Variant, size: Size, className?: string) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className } = props;
  const classes = buildClasses(variant, size, className);

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      className: _c,
      children,
      ...rest
    } = props as BaseProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children, ...rest } =
    props as BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

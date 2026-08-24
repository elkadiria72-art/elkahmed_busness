"use client";

import Link from "next/link";
import { type FormEvent } from "react";

import { Button } from "@/components/Button";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to Supabase auth
    console.log("Login", Object.fromEntries(new FormData(event.currentTarget)));
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-950">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        Sign in to access your client portal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:text-accent-600"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClasses}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-neutral-300 accent-[#1F3B57]"
          />
          Remember me for 30 days
        </label>
        <Button type="submit" size="lg" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Don&rsquo;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:text-accent-600">
          Register
        </Link>
      </p>
    </div>
  );
}

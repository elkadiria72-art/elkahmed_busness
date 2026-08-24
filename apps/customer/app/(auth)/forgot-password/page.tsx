"use client";

import Link from "next/link";
import { type FormEvent } from "react";

import { Button } from "@/components/Button";

export default function ForgotPasswordPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to Supabase auth (resetPasswordForEmail)
    console.log("Forgot password", Object.fromEntries(new FormData(event.currentTarget)));
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-950">Reset your password</h1>
      <p className="mb-6 mt-1 text-sm leading-relaxed text-neutral-600">
        Enter the email linked to your account and we will send you a link to
        set a new password.
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
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Remembered it after all?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-accent-600">
          Sign In
        </Link>
      </p>
    </div>
  );
}

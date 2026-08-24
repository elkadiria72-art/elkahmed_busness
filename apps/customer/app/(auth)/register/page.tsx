"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/Button";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to Supabase auth (sign-up + email confirmation)
    console.log("Register", Object.fromEntries(new FormData(event.currentTarget)));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-primary-950">Check your inbox</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          If the address is valid you will receive a confirmation email shortly.
          Follow the link inside to activate your account.
        </p>
        <Button href="/login" variant="ghost" className="mt-6 w-full">
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-950">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        Track your projects, messages and files in one place.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-neutral-800">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
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
        <div>
          <label htmlFor="password" className="text-sm font-medium text-neutral-800">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="text-sm font-medium text-neutral-800">
            Confirm Password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-[#1F3B57]"
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <Button type="submit" size="lg" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-accent-600">
          Sign In
        </Link>
      </p>
    </div>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/Button";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to backend / Supabase
    console.log("Contact form", Object.fromEntries(new FormData(event.currentTarget)));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-accent" aria-hidden />
        <h3 className="mt-4 text-lg font-semibold text-primary-950">
          Message sent!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">
          Thanks for reaching out — we will reply to your email within one
          business day.
        </p>
        <Button variant="ghost" className="mt-6" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-neutral-800">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          className={inputClasses}
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
          placeholder="you@company.com"
          className={inputClasses}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="subject" className="text-sm font-medium text-neutral-800">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What is this about?"
          className={inputClasses}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="text-sm font-medium text-neutral-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us a little about what you need…"
          className={inputClasses}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Send Message
        </Button>
        <p className="mt-3 text-xs text-neutral-500">
          We will never share your details with anyone else.
        </p>
      </div>
    </form>
  );
}

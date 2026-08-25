import { ShieldAlert } from "lucide-react";

import { SignOutButton } from "@/components/SignOutButton";

/**
 * Rendered when the signed-in user is not an admin. Receives no props and
 * triggers no queries — nothing about the app's data is exposed here.
 */
export function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
        <ShieldAlert className="h-7 w-7 text-red-500" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-primary-950">
        Access Denied
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
        Your account does not have administrator permissions. If you believe this
        is a mistake, ask an existing admin to promote your account.
      </p>
      <SignOutButton />
    </div>
  );
}

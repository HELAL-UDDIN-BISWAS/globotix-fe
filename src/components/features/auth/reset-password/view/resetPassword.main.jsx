"use client";
import ResetPasswordView from "@/components/features/auth/reset-password/view/resetPassword.view";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}

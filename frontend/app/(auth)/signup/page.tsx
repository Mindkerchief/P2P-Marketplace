"use client";

import { SignupForm } from "@/components/signup-form"
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (formData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const res = await fetch("http://localhost:5566/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        alert(text ?? `Login failed (${res.status})`);
        return;
      }

      // On successful signup redirect to login page
      router.push("/login");
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 pt-28 mb:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm onSubmitData={handleSubmit} />
      </div>
    </div>
  );
}

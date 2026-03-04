"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (formData: { email: string; password: string }) => {
    try {
      const res = await fetch("http://127.0.0.1:5566/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        alert(text ?? `Login failed (${res.status})`);
        return;
      }

      // On successful login, redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmitData={handleSubmit} />
      </div>
    </div>
  );
}

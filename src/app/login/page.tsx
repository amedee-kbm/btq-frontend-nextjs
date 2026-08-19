"use client";
import "react";
import LoginForm from "@/components/ui/login-form";
import { useAuth } from "@/components/auth-provider";

export default function Login() {
  const auth = useAuth();

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const objectFromForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFromForm);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };
    const response = await fetch("/api/login", requestOptions);
    console.log("response", response);
    let data = {};
    try {
      data = await response.json();
    } catch (error) {}
    if (response.ok) {
      console.log("logged in");
      auth.login();
    }
  }
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center px-4 py-8">
      <LoginForm onSubmit={handleLoginSubmit} />
    </div>
  );
}

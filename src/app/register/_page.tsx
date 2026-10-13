"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaHome } from "react-icons/fa";

// اسکیمای ولیدیشن
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post("/api/auth/register", data);
      setSuccessMsg(res.data.message);
      reset();
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-card p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-foreground">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              {...register("name")}
              placeholder="Name"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {errorMsg && (
            <p className="text-destructive text-center mt-2">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-success text-center mt-2">{successMsg}</p>
          )}
        </form>

        <p className="text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <FaHome className="text-muted-foreground" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

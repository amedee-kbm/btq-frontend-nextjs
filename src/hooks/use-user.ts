"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  is_staff: boolean;
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    "/api/me",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const isAuthenticated = Boolean(data && data.id);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      mutate(undefined, false);
    }
  };

  const login = async () => {
    await mutate();
  };

  return {
    user: data || null,
    isAuthenticated,
    isLoading,
    isError: error,
    logout,
    login,
    mutate,
  };
}

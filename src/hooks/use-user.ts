"use client";

import useSWR, { useSWRConfig } from "swr";
import fetcher from "@/lib/fetcher";

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  is_staff: boolean;
}

export function useUser() {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    "/api/me",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const isAuthenticated = Boolean(data?.id);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      await mutate(undefined, false);
      await globalMutate("/api/favorites", undefined, false);
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

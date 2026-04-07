const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiSuccess<T> = {
  retCode: string;
  message: string;
  data: T;
};

async function apiFetch<T>(route: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${route}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const parsed = (await res.json()) as Partial<ApiSuccess<T>> & {
    data?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(
      parsed?.data?.message ?? "An unexpected error occurred. Please try again later."
    );
  }

  return (parsed.data ?? {}) as T;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const data = await apiFetch<{ notifications: Notification[] }>("/notifications", {
    method: "GET",
  });
  return data.notifications ?? [];
}

export async function markNotificationsRead(): Promise<void> {
  await apiFetch("/notifications/read", { method: "PATCH" });
}
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiSuccess<T> = {
  retCode: string;
  message: string;
  data: T;
};

<<<<<<< HEAD
=======
export type NotificationDto = {
  id: string;
  userId: string;
  type: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
};

>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
async function apiFetch<T>(route: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${route}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
<<<<<<< HEAD
=======

>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
  const parsed = (await res.json()) as Partial<ApiSuccess<T>> & {
    data?: { message?: string };
  };

  if (!res.ok) {
<<<<<<< HEAD
    throw new Error(
      parsed?.data?.message ?? "An unexpected error occurred. Please try again later."
    );
=======
    throw new Error(parsed?.data?.message ?? "An unexpected error occurred. Please try again later.");
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
  }

  return (parsed.data ?? {}) as T;
}

<<<<<<< HEAD
export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const data = await apiFetch<{ notifications: Notification[] }>("/notifications", {
=======
export async function getNotifications(): Promise<NotificationDto[]> {
  const data = await apiFetch<{ notifications: NotificationDto[] }>("/notifications", {
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
    method: "GET",
  });
  return data.notifications ?? [];
}

<<<<<<< HEAD
export async function markNotificationsRead(): Promise<void> {
  await apiFetch("/notifications/read", { method: "PATCH" });
}
=======
export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch<{ isSuccess: boolean }>("/notifications/read-all", {
    method: "PATCH",
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiFetch<{ isSuccess: boolean }>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7

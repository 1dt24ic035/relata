"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  actor_id: string | null;
  type: string;
  experience_id: string | null;
  comment_id: string | null;
  message: string;
  read_at: string | null;
  created_at: string;
};

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data,
      error: notificationError,
    } = await supabase
      .from("notifications")
      .select(
        "id, actor_id, type, experience_id, comment_id, message, read_at, created_at"
      )
      .eq("recipient_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (notificationError) {
      console.error(
        "Notifications error:",
        notificationError
      );

      setError(
        "Unable to load notifications."
      );

      setNotifications([]);
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(
    notificationId: string
  ) {
    const { error } = await supabase
      .from("notifications")
      .update({
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    if (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      return;
    }

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read_at:
                new Date().toISOString(),
            }
          : notification
      )
    );
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        read_at: new Date().toISOString(),
      })
      .eq("recipient_id", user.id)
      .is("read_at", null);

    if (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      return;
    }

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read_at:
          notification.read_at ||
          new Date().toISOString(),
      }))
    );
  }

  async function openNotification(
    notification: Notification
  ) {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    if (notification.experience_id) {
      router.push(
        `/experiences/${notification.experience_id}`
      );
      return;
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-400">
            Loading notifications...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/feed"
              className="mb-5 inline-block text-purple-400 transition hover:text-purple-300"
            >
              ← Back to Feed
            </Link>

            <h1 className="text-5xl font-bold">
              Notifications
            </h1>

            <p className="mt-3 text-gray-400">
              Stay updated on activity around your
              experiences.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-purple-500 hover:text-white"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && !error && (
          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-16 text-center">
            <div className="mb-5 text-6xl">
              🔔
            </div>

            <h2 className="text-2xl font-bold">
              No notifications yet
            </h2>

            <p className="mt-3 text-gray-400">
              When someone likes or comments on your
              experience, you'll see it here.
            </p>

            <Link
              href="/feed"
              className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Explore Experiences
            </Link>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map(
              (notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    openNotification(
                      notification
                    )
                  }
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    notification.read_at
                      ? "border-gray-800 bg-zinc-950 hover:border-gray-700"
                      : "border-purple-500/40 bg-purple-500/10 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
                        notification.type ===
                        "like"
                          ? "bg-red-500/15"
                          : "bg-purple-500/15"
                      }`}
                    >
                      {notification.type ===
                      "like"
                        ? "❤️"
                        : "💬"}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p
                          className={`leading-6 ${
                            notification.read_at
                              ? "text-gray-400"
                              : "font-semibold text-white"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {!notification.read_at && (
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500" />
                        )}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>

                      {notification.experience_id && (
                        <p className="mt-3 text-sm font-semibold text-purple-400">
                          View experience →
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        )}

      </div>
    </main>
  );
}
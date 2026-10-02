"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";

type Report = {
  id: string;
  reporter_id: string;
  experience_id: string | null;
  reported_user_id: string | null;
  reason: string;
  details: string | null;
  status: "pending" | "reviewed" | "dismissed" | "resolved";
  created_at: string;
  reviewed_at: string | null;
  reporter: {
    display_name: string | null;
    username: string | null;
  } | null;
  experience: {
    title: string;
    story: string;
  } | null;
};

const statusOptions = [
  "pending",
  "reviewed",
  "dismissed",
  "resolved",
] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function statusClasses(status: Report["status"]) {
  if (status === "pending") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
  }

  if (status === "reviewed") {
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  }

  if (status === "resolved") {
    return "bg-green-500/10 text-green-300 border-green-500/20";
  }

  return "bg-gray-500/10 text-gray-400 border-gray-500/20";
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [filter, setFilter] = useState<
    "all" | Report["status"]
  >("pending");
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadReports();
  }

  async function loadReports() {
    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        id,
        reporter_id,
        experience_id,
        reported_user_id,
        reason,
        details,
        status,
        created_at,
        reviewed_at
        `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error loading reports:",
        error
      );

      setReports([]);
      setLoading(false);
      return;
    }

    const enrichedReports =
      await Promise.all(
        (data || []).map(async (report) => {
          let reporter = null;
          let experience = null;

          if (report.reporter_id) {
            const { data: reporterData } =
              await supabase
                .from("profiles")
                .select(
                  "display_name, username"
                )
                .eq(
                  "id",
                  report.reporter_id
                )
                .maybeSingle();

            reporter = reporterData;
          }

          if (report.experience_id) {
            const { data: experienceData } =
              await supabase
                .from("experiences")
                .select(
                  "title, story"
                )
                .eq(
                  "id",
                  report.experience_id
                )
                .maybeSingle();

            experience = experienceData;
          }

          return {
            ...report,
            reporter,
            experience,
          };
        })
      );

    setReports(enrichedReports);
    setLoading(false);
  }

  async function updateStatus(
    reportId: string,
    status: Report["status"]
  ) {
    setUpdatingId(reportId);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUpdatingId(null);
      return;
    }

    const { error } = await supabase
      .from("reports")
      .update({
        status,
        reviewed_at:
          status === "pending"
            ? null
            : new Date().toISOString(),
        reviewed_by:
          status === "pending"
            ? null
            : user.id,
      })
      .eq("id", reportId);

    if (error) {
      console.error(
        "Error updating report:",
        error
      );

      alert(
        "Could not update this report."
      );

      setUpdatingId(null);
      return;
    }

    setReports((previous) =>
      previous.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status,
              reviewed_at:
                status === "pending"
                  ? null
                  : new Date().toISOString(),
            }
          : report
      )
    );

    setUpdatingId(null);
  }

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter(
          (report) =>
            report.status === filter
        );

  const pendingCount = reports.filter(
    (report) =>
      report.status === "pending"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <AppNav />

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-zinc-900" />

          <div className="mt-4 h-5 w-96 animate-pulse rounded bg-zinc-900" />

          <div className="mt-10 h-64 animate-pulse rounded-3xl bg-zinc-900" />
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white">
        <AppNav />

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-red-500/20 bg-zinc-950 p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
              🔒
            </div>

            <h1 className="text-3xl font-bold">
              Admin access required
            </h1>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You don't have permission to access
              the moderation dashboard.
            </p>

            <Link
              href="/feed"
              className="mt-7 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Back to Relata
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-20 text-white md:pb-0">
      <AppNav />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                Admin
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Moderation
              </h1>

              <p className="mt-3 max-w-2xl text-gray-500">
                Review reports and keep the Relata
                community safe.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4">
              <p className="text-sm text-gray-500">
                Pending reports
              </p>

              <p className="mt-1 text-3xl font-bold text-yellow-300">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {(
            [
              ["pending", "Pending"],
              ["reviewed", "Reviewed"],
              ["resolved", "Resolved"],
              ["dismissed", "Dismissed"],
              ["all", "All Reports"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setFilter(value)
              }
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                filter === value
                  ? "bg-purple-600 text-white"
                  : "border border-white/10 bg-zinc-900 text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredReports.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold">
              No reports here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              There are no reports matching this
              filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map(
              (report) => (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
                >
                  <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>

                        <span className="text-xs text-gray-600">
                          {formatDate(
                            report.created_at
                          )}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold">
                        {report.reason}
                      </h2>
                    </div>

                    {report.experience_id && (
                      <Link
                        href={`/experiences/${report.experience_id}`}
                        className="shrink-0 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20"
                      >
                        View Experience →
                      </Link>
                    )}
                  </div>

                  <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_300px]">
                    <div>
                      {report.experience && (
                        <div className="rounded-2xl border border-white/10 bg-black p-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Reported Experience
                          </p>

                          <h3 className="mt-2 text-lg font-bold text-white">
                            {
                              report
                                .experience
                                .title
                            }
                          </h3>

                          <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                            {
                              report
                                .experience
                                .story
                            }
                          </p>
                        </div>
                      )}

                      <div className="mt-5 rounded-2xl border border-white/10 bg-black p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Additional Details
                        </p>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                          {report.details ||
                            "No additional details provided."}
                        </p>
                      </div>
                    </div>

                    <aside className="rounded-2xl border border-white/10 bg-black p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Reported By
                      </p>

                      <div className="mt-3">
                        <p className="font-semibold text-white">
                          {report
                            .reporter
                            ?.display_name ||
                            "User"}
                        </p>

                        {report
                          .reporter
                          ?.username && (
                          <p className="mt-1 text-sm text-purple-400">
                            @
                            {
                              report
                                .reporter
                                .username
                            }
                          </p>
                        )}
                      </div>

                      <div className="my-5 h-px bg-white/10" />

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Update Status
                      </p>

                      <div className="mt-3 space-y-2">
                        {statusOptions.map(
                          (status) => (
                            <button
                              key={status}
                              disabled={
                                updatingId ===
                                report.id
                              }
                              onClick={() =>
                                updateStatus(
                                  report.id,
                                  status
                                )
                              }
                              className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-semibold capitalize transition ${
                                report.status ===
                                status
                                  ? statusClasses(
                                      status
                                    )
                                  : "border-white/10 bg-zinc-900 text-gray-400 hover:text-white"
                              } ${
                                updatingId ===
                                report.id
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                            >
                              {status ===
                              "resolved"
                                ? "✓ "
                                : ""}
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </aside>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
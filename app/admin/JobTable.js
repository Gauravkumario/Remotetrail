"use client";

import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
};

const formatRelativeTime = (value) => {
  const date = parseDate(value);
  if (!date) return "—";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const tense = diff >= 0 ? "ago" : "from now";
  const absDiff = Math.abs(diff);

  const units = [
    { label: "day", ms: 24 * 60 * 60 * 1000 },
    { label: "hour", ms: 60 * 60 * 1000 },
    { label: "minute", ms: 60 * 1000 },
  ];

  for (const unit of units) {
    const amount = Math.floor(absDiff / unit.ms);
    if (amount > 0) {
      return `${amount} ${unit.label}${amount > 1 ? "s" : ""} ${tense}`;
    }
  }

  return diff >= 0 ? "moments ago" : "moments from now";
};

const formatSkills = (skills) =>
  (skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 4);

const getJobStatus = (expiresAt) => {
  if (!expiresAt) {
    return { label: "Draft", tone: "text-[#d1d5db] bg-[#374151]" };
  }

  const expiry = parseDate(expiresAt);
  if (!expiry) {
    return { label: "Unknown", tone: "text-[#d1d5db] bg-[#374151]" };
  }

  if (expiry < new Date()) {
    return { label: "Expired", tone: "text-[#fca5a5] bg-[#451a1a]" };
  }

  return { label: "Active", tone: "text-[#bbf7d0] bg-[#14532d]" };
};

export default function JobTable({ jobs = [], onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#1f2735] border-t-[#3b82f6]" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#374151] bg-[#111827] py-12 text-center text-sm text-[#9CA3AF]">
        No jobs found. Create your first listing to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#1f2735] text-left text-sm text-[#d1d5db]">
        <thead>
          <tr className="bg-[#0f172a] text-xs uppercase tracking-wide text-[#9CA3AF]">
            <th className="px-4 py-3">S.No</th>
            <th className="px-6 py-3">Job Title</th>
            <th className="px-6 py-3">Company</th>
            <th className="px-6 py-3">Expires</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1f2735]">
          {jobs.map((job, index) => (
            <tr key={job.id} className="align-top hover:bg-[#1f2531]">
              <td className="px-4 py-4 text-xs font-semibold text-[#6b7280]">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-[#f3f4f6]">
                {job.title || "Untitled role"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {job.company || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {job.expiresAt ? formatRelativeTime(job.expiresAt) : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(job)}
                    className="text-teal-500 hover:text-teal-400 transition-colors"
                    aria-label="Edit job"
                  >
                    <FaRegEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    aria-label="Delete job"
                  >
                    <FaRegTrashAlt className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

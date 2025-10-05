"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaStar,
  FaClock,
  FaSearch,
} from "react-icons/fa";

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 1) {
    return `${days} days ago`;
  } else if (days === 1) {
    return "1 day ago";
  } else {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 1) {
      return `${hours} hours ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes > 1) {
        return `${minutes} minutes ago`;
      }
      return "Just now";
    }
  }
}

function formatSkills(skills) {
  if (!skills) return [];
  return skills.split(",").map((skill) => skill.trim());
}

function getInitials(company) {
  if (!company) return "";
  const words = company.split(" ");
  if (words.length > 1) {
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
  return company.substring(0, 2).toUpperCase();
}

export default function Home({ jobs = [] }) {
  const [visibleJobsCount, setVisibleJobsCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const sortedJobs = useMemo(() => {
    return [...jobs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return sortedJobs
      .filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((job) => (jobTypeFilter ? job.jobType === jobTypeFilter : true))
      .filter((job) =>
        experienceFilter ? job.experience === experienceFilter : true
      );
  }, [sortedJobs, searchQuery, jobTypeFilter, experienceFilter]);

  const visibleJobs = filteredJobs.slice(0, visibleJobsCount);

  const handleShowMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 10);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setVisibleJobsCount(10);
  };

  const jobTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.jobType))],
    [jobs]
  );
  const experiences = useMemo(
    () => [...new Set(jobs.map((job) => job.experience))],
    [jobs]
  );

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-b from-[#111827] via-[#111827] to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="space-y-6 text-center sm:text-left">
            <span className="inline-flex items-center rounded-full border border-[#374151] bg-[#1f2937] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
              Remote-first opportunities curated for builders
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
              Discover remote roles from product-led teams shipping across the
              globe.
            </h1>
            <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl">
              RemoteTrail highlights remote-friendly companies hiring
              asynchronously. Browse engineering, design, data, and go-to-market
              roles without geographic limits.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f2937] bg-[#0f172a]/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#374151] bg-[#1f2937] px-4 py-3 pl-10 text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-[#374151] bg-[#1f2937] px-4 py-2 text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              >
                <option value="">All Job Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full rounded-lg border border-[#374151] bg-[#1f2937] px-4 py-2 text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              >
                <option value="">All Experience Levels</option>
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              <button
                onClick={handleResetFilters}
                className="w-full rounded-lg border border-[#374151] bg-[#1f2937] px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Featured roles
              </h2>
              <p className="text-sm text-[#9CA3AF]">
                Updated every morning with teams hiring worldwide.
              </p>
            </div>
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wide">
              Updated {formatRelativeTime(jobs[0]?.updatedAt)}
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#374151] bg-[#111827] px-6 py-12 text-center text-[#9CA3AF]">
              <p className="mb-4">No jobs match your current filters.</p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center rounded-lg border border-[#1f2735] bg-[#1b2534] px-6 py-3 text-sm font-semibold text-[#f3f4f6] transition hover:border-[#3b82f6] hover:text-[#93c5fd]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleJobs.map((job) => {
                const skills = formatSkills(job.skills);
                return (
                  <article
                    key={job.id}
                    className="group rounded-xl border border-[#1f2735] bg-[#111827] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#3b82f6]/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#ffffff] ring-1 ring-[#1f2735]">
                          {job.logo ? (
                            <Image
                              src={job.logo}
                              alt={`${job.company} logo`}
                              width={48}
                              height={48}
                              className="h-full w-full object-contain p-1.5"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#60a5fa]">
                              {getInitials(job.company)}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-white leading-tight mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#9CA3AF]">
                            <span className="flex items-center gap-1.5 font-medium text-[#f3f4f6]">
                              <FaBuilding className="text-sky-400" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaMapMarkerAlt className="text-rose-400" />
                              {job.location}
                            </span>
                            {job.salary && (
                              <span className="flex items-center gap-1.5">
                                <FaMoneyBillWave className="text-emerald-400" />
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {job.applyLink ? (
                        <Link
                          href={job.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20 shadow-md backdrop-blur-lg flex-shrink-0"
                        >
                          Apply Now
                        </Link>
                      ) : (
                        <Link
                          href="/admin"
                          className="hidden sm:inline-flex items-center justify-center rounded-md border border-[#1f2735] bg-[#3b82f6] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2563eb] flex-shrink-0"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full border border-[#1f2735] bg-[#1f2937] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">
                        <FaBriefcase className="text-indigo-400" />
                        {job.jobType}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full border border-[#1f2735] bg-[#1f2937] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">
                        <FaStar className="text-amber-400" />
                        {job.experience}
                      </span>
                      {skills.slice(0, 3).map((skill) => (
                        <span
                          key={`${job.id}-${skill}`}
                          className="hidden md:inline-block rounded-full border border-[#1f2735] bg-[#0b1220] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]"
                        >
                          {skill}
                        </span>
                      ))}
                      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#6b7280] ml-auto">
                        <FaClock className="text-slate-400" />
                        {formatRelativeTime(job.createdAt)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {visibleJobs.length < filteredJobs.length && (
            <div className="mt-8 text-center">
              <button
                onClick={handleShowMore}
                className="inline-flex items-center justify-center rounded-lg border border-[#1f2735] bg-[#1b2534] px-6 py-3 text-sm font-semibold text-[#f3f4f6] transition hover:border-[#3b82f6] hover:text-[#93c5fd]"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

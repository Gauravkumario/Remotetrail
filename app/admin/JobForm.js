"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function JobForm({ job, onSuccess }) {
  const createEmptyForm = () => ({
    title: "",
    company: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experience: "Entry level",
    skills: "",
    description: "",
    logo: null,
    logoPreview: null,
    existingLogo: null,
    applyLink: "",
  });

  // Form state
  const [formData, setFormData] = useState(createEmptyForm);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load job data when editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        salary: job.salary || "",
        location: job.location || "Remote",
        jobType: job.jobType || "Full-time",
        experience: job.experience || "Mid-level",
        skills: job.skills || "",
        description: job.description || "",
        logo: null,
        logoPreview: job.logo || null,
        existingLogo: job.logo || null,
        applyLink: job.applyLink || "",
      });
    }
  }, [job]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: file,
          logoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  // Reset form
  const resetForm = () => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        salary: job.salary || "",
        location: job.location || "Remote",
        jobType: job.jobType || "Full-time",
        experience: job.experience || "Mid-level",
        skills: job.skills || "",
        description: job.description || "",
        logo: null,
        logoPreview: job.logo || null,
        existingLogo: job.logo || null,
        applyLink: job.applyLink || "",
      });
    } else {
      setFormData(createEmptyForm());
    }
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for file upload
      const formPayload = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "logo" && key !== "logoPreview" && key !== "existingLogo") {
          formPayload.append(key, formData[key]);
        }
      });

      // Add the logo file if present
      if (formData.logo) {
        formPayload.append("logo", formData.logo);
      }

      // Add existing logo path if editing and not changing logo
      if (job && formData.existingLogo && !formData.logo) {
        formPayload.append("existingLogo", formData.existingLogo);
      }

      // Determine if it's an update or create operation
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs";
      const method = job ? "PUT" : "POST";

      // Send the request
      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          job ? "Job updated successfully!" : "Job created successfully!"
        );

        // If not editing, reset the form
        if (!job) {
          resetForm();
        }

        // Notify parent component
        onSuccess(data.job);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Remote",
  ];

  const experienceOptions = [
    "Entry level",
    "1-3 years",
    "3-5 years",
    "5-7 years",
    "7+ years",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {job ? "Update job" : "Create a new job"}
        </h2>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-500/60 bg-red-900/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md border border-green-500/60 bg-green-900/30 px-4 py-3 text-sm text-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Job Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Product Designer"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="experience"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Experience Level
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g. RemoteTrail"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Remote or Berlin, Germany"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="salary"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Salary Range
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $90k - $120k"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="jobType"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {jobTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label
              htmlFor="skills"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Required Skills <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g. React, Node.js, UI design"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-[#6b7280]">
              Separate skills with commas.
            </p>
          </div>

          <div className="md:col-span-1">
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-[#d1d5db]">
                Company Logo
              </label>
              {formData.logoPreview && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      logo: null,
                      logoPreview: null,
                      existingLogo: null,
                    }))
                  }
                  className="text-xs text-[#9ca3af] transition hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />

            <div className="flex items-center gap-3 rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded bg-[#1f2937]/60">
                {formData.logoPreview ? (
                  <Image
                    src={formData.logoPreview}
                    alt="Company logo preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-wide text-[#6b7280]">
                    No Logo
                  </span>
                )}
              </div>

              <div className="flex-1 text-xs text-[#9ca3af]">
                <label
                  htmlFor="logo"
                  className="inline-flex cursor-pointer items-center justify-center rounded border border-[#374151] px-2 py-1 text-[11px] font-medium text-gray-100 transition hover:border-blue-500 hover:text-blue-300"
                >
                  {formData.logo ? "Change file" : "Upload"}
                </label>
                <p className="mt-1 truncate text-[#6b7280]">
                  {formData.logo
                    ? formData.logo.name
                    : formData.logoPreview
                    ? "Preview ready"
                    : "PNG, JPG or GIF up to 2MB"}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Job Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Share the mission, responsibilities, and what success looks like."
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="applyLink"
              className="mb-1 block text-sm font-medium text-[#d1d5db]"
            >
              Apply Link
            </label>
            <input
              type="url"
              id="applyLink"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              placeholder="https://example.com/apply"
              className="w-full rounded-md border border-[#1f2937] bg-[#111827] px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#1f2937] pt-4 md:flex-row md:items-center md:justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center rounded-md border border-[#374151] px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:border-blue-500 hover:text-[#93c5fd]"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] disabled:opacity-80"
            disabled={loading}
          >
            {loading && (
              <svg
                className="-ml-1 mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{job ? "Update job" : "Publish job"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

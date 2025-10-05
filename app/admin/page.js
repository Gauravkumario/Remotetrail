"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import JobForm from "./JobForm";
import JobTable from "./JobTable";

export default function AdminDashboard() {
  // State
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/");
    } else {
      fetchJobs();
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    router.push("/");
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("Unexpected jobs payload", data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on initial render
  useEffect(() => {
    fetchJobs();
  }, []);

  // Edit a job
  const handleEdit = (job) => {
    setEditingJob(job);
    setActiveTab("create");
  };

  // Delete a job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Update local state by filtering out the deleted job
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
      } else {
        alert(`Failed to delete job: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("An error occurred while deleting the job");
    }
  };

  // Handle job save success
  const handleJobSaved = (job) => {
    if (!job) {
      // If no job data, refresh all jobs
      fetchJobs();
    } else if (editingJob) {
      // Update existing job
      setJobs((prevJobs) => prevJobs.map((j) => (j.id === job.id ? job : j)));
    } else {
      // Add new job to the top of the list
      setJobs((prevJobs) => [job, ...prevJobs]);
    }

    // Reset editing job and switch to jobs tab
    setEditingJob(null);
    setActiveTab("jobs");
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && sessionStorage.getItem("isAdminAuthenticated") !== "true") {
    return null; // Render nothing while redirecting
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === "jobs"
              ? "bg-[#3b82f6] text-white"
              : "text-[#9CA3AF] hover:text-[#f3f4f6] hover:bg-[#374151]"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("jobs")}
        >
          Job Listings
        </button>
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === "create"
              ? "bg-[#3b82f6] text-white"
              : "text-[#9CA3AF] hover:text-[#f3f4f6] hover:bg-[#374151]"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => {
            setEditingJob(null);
            setActiveTab("create");
          }}
        >
          {editingJob ? "Update Job" : "Create Job"}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 bg-[#1f2937] rounded-lg shadow-md">
        {activeTab === "jobs" ? (
          <>
            <JobTable
              jobs={currentJobs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between text-sm text-gray-400">
                <div>
                  Showing{" "}
                  <span className="font-semibold text-gray-200">
                    {Math.min((currentPage - 1) * jobsPerPage + 1, jobs.length)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-200">
                    {Math.min(currentPage * jobsPerPage, jobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-200">
                    {jobs.length}
                  </span>{" "}
                  results
                </div>
                <div className="inline-flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 p-2 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 p-2 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next Page"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <JobForm job={editingJob} onSuccess={handleJobSaved} />
        )}
      </div>
    </div>
  );
}

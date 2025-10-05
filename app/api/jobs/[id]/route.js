import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const jobsFilePath = path.join(process.cwd(), "data", "jobs.json");

async function getJobs() {
  try {
    const data = await fs.readFile(jobsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function saveJobs(jobs) {
  await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2));
}

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({
    id: job.id,
  }));
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const jobs = await getJobs();

    const jobIndex = jobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    const updatedJob = {
      ...jobs[jobIndex],
      updatedAt: new Date().toISOString(),
    };

    for (const [key, value] of formData.entries()) {
      if (key !== "logo" && key !== "existingLogo") {
        updatedJob[key] = value;
      }
    }

    const logoFile = formData.get("logo");
    if (
      logoFile &&
      logoFile.name &&
      typeof logoFile.arrayBuffer === "function"
    ) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });
        const fileName = `${Date.now()}_${logoFile.name.replace(/\s/g, "_")}`;
        const filePath = path.join(uploadsDir, fileName);
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);
        updatedJob.logo = `/uploads/${fileName}`;
      } catch (uploadError) {
        console.error("Error uploading logo:", uploadError);
      }
    } else {
      updatedJob.logo = formData.get("existingLogo") || updatedJob.logo;
    }

    jobs[jobIndex] = updatedJob;
    await saveJobs(jobs);

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error(`Error in PUT /api/jobs/${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const jobs = await getJobs();

    const jobIndex = jobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    jobs.splice(jobIndex, 1);
    await saveJobs(jobs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/jobs/${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

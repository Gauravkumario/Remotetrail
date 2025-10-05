import { NextResponse } from "next/server";
import fs from "fs/promises";

export const dynamic = "force-static";
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

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error in GET /api/jobs:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const jobs = await getJobs();

    const expires = new Date();
    expires.setDate(expires.getDate() + 14);

    const newJob = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: expires.toISOString(),
    };

    for (const [key, value] of formData.entries()) {
      if (key !== "logo") {
        newJob[key] = value;
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
        newJob.logo = `/uploads/${fileName}`;
      } catch (uploadError) {
        console.error("Error uploading logo:", uploadError);
        // Decide if you want to fail the whole request or just skip the logo
        // For now, we'll just log it and continue without a logo
      }
    }

    const updatedJobs = [newJob, ...jobs];
    await saveJobs(updatedJobs);

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error("Error in POST /api/jobs:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

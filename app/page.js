import HomeContent from "./components/HomeContent";
import jobs from "@/data/jobs.json";

export default function Home() {
  return (
    <>
      <HomeContent jobs={jobs} />
    </>
  );
}

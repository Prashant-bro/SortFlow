import ScheduleSendBox from "@/components/ScheduleSendBox";

export default function ComposePage() {
  return (
    <div className="min-h-screen p-10 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold mb-4">✍️ Compose & Schedule</h1>
      <ScheduleSendBox />
    </div>
  );
}

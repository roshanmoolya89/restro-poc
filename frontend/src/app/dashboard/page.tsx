import { Dashboard } from "@/src/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="w-full h-full font-sans">
      <main className="w-full h-full items-center justify-center text-center p-4">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-white">
          Welcome to the Kitchen Spurs Dashboard!
        </h1>
      </main>
      <Dashboard />
    </div>
  );
}

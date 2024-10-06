// Dashboard

"use client";

import Header from "@/components/layout/Header";
import AthleteBoard from "@/components/pages/AthleteBoard";
import LeaderBoard from "@/components/pages/LeaderBoard";
import MetricBoard from "@/components/pages/MetricBoard";
import { AthleteDataProvider } from "@/components/providers/AthleteDataProvider";
import { useState } from "react";


function Dashboard() {
  const [view, setView] = useState<"leader" | "athlete" | "metrics">("leader");

  return (
    <div className="flex flex-col w-[93%] h-full mx-auto pb-4">
      <Header setView={setView} />

      {view === "leader" && (
        <LeaderBoard />
      )}

      {view === "athlete" && (
        <AthleteBoard />
      )}

      {view === "metrics" && (
        <MetricBoard />
      )}
    </div>
  );
}

export default function DashboardWithProvider() {
  return (
    <AthleteDataProvider>
      <Dashboard />
    </AthleteDataProvider>
  );
}

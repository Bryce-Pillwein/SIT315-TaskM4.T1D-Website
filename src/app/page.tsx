// Dashboard

"use client";

import AthleteDetails from "@/components/AthleteDetails";
// import AthleteHistory from "@/components/AthleteHistory";
import AthleteList from "@/components/AthleteList";
import Charts from "@/components/Charts";
import Header from "@/components/layout/Header";
import { AthleteDataProvider } from "@/components/providers/AthleteDataProvider";
import dynamic from "next/dynamic";

const DynAthleteMap = dynamic(() => import('../components/AthleteMap'), { ssr: false });

function Dashboard() {

  return (
    <div className="app-container pb-16">
      <Header />

      <div className="grid grid-cols-5 gap-x-4">
        <div className="col-span-3">
          <DynAthleteMap />
        </div>

        <div className="col-span-1">
          <AthleteDetails />
        </div>

        <div className="col-span-1">
          <AthleteList />
        </div>
      </div>

      <Charts />
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

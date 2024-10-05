// Header tsx

"use client";

import { deleteAll } from "@/services";
import SimulatorControl from "../controls/SimulatorControl";
import IconGeneral from "./IconGeneral";
import { useAthleteDataContext } from "../providers/AthleteDataProvider";

export default function Header() {
  const { fetchAllAthleteData } = useAthleteDataContext();

  const deleteAllData = async () => {
    try {
      await deleteAll();
    } catch (error) {
      console.error("Error clearing database: ", error);
    }
  };

  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-2xl font-semibold">Athlete Fitness Tracker</h1>

      <SimulatorControl />

      <button type="button" onClick={fetchAllAthleteData}
        className="group flex justify-center items-center gap-x-2 px-4 py-2 bg-hsl-l95 hover:bg-mb-pink rounded-md text-sm">
        <IconGeneral type="bolt" className="fill-mb-pink group-hover:fill-hsl-l100" />
        <p className="font-medium group-hover:text-hsl-l100">Retrieve Data</p>
      </button>

      <button type="button" onClick={deleteAllData}
        className="group flex justify-center items-center gap-x-2 px-4 py-2 bg-hsl-l95 hover:bg-mb-pink rounded-md text-sm"
      >
        <IconGeneral type="delete" className="fill-hsl-l50 group-hover:fill-hsl-l100" size={18} />
        <p className="font-medium group-hover:text-hsl-l100">Database</p>
      </button>
    </header>
  );
}
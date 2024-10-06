// Header tsx

"use client";

import { deleteAll } from "@/services";
import SimulatorControl from "../controls/SimulatorControl";
import IconGeneral from "./IconGeneral";
import { useAthleteDataContext } from "../providers/AthleteDataProvider";

interface HeaderProps {
  setView: (view: "leader" | "athlete" | "metrics") => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
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
      <h1 className="text-2xl font-semibold">Athlete Tracker</h1>

      <div className="flex gap-x-8">
        <button type="button" onClick={() => { setView("leader") }}
          className="bg-hsl-l95 text-sm font-semibold px-4 py-2 rounded-md hover:bg-mb-pink hover:text-white">
          Leader Board
        </button>
        <button type="button" onClick={() => { setView("athlete") }}
          className="bg-hsl-l95 text-sm font-semibold px-4 py-2 rounded-md hover:bg-mb-pink hover:text-white">
          Athletes
        </button>
        <button type="button" onClick={() => { setView("metrics") }}
          className="bg-hsl-l95 text-sm font-semibold px-4 py-2 rounded-md hover:bg-mb-pink hover:text-white">
          IoT Metrics
        </button>
      </div>

      <SimulatorControl />

      <div className="flex gap-x-4">
        <button type="button" onClick={fetchAllAthleteData}
          className="group flex justify-center items-center gap-x-2 px-4 py-1 bg-hsl-l95 hover:bg-mb-pink rounded-md text-sm">
          <IconGeneral type="sync" className="fill-hsl-l50 group-hover:fill-hsl-l100" />
          <p className="font-medium group-hover:text-hsl-l100">Data</p>
        </button>

        <button type="button" onClick={deleteAllData}
          className="group flex justify-center items-center gap-x-2 px-4 py-1 bg-hsl-l95 hover:bg-mb-pink rounded-md text-sm">
          <IconGeneral type="delete" className="fill-hsl-l50 group-hover:fill-hsl-l100" size={18} />
          <p className="font-medium group-hover:text-hsl-l100">Data</p>
        </button>
      </div>
    </header>
  );
}

export default Header;
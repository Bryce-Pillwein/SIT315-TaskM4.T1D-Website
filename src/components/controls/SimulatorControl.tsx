// Simulator Controls tsx

"use client";

import { useState } from "react";
import axios from "axios";
import IconGeneral from "../layout/IconGeneral";

const SimulatorControl = () => {
  const [athleteCount, setAthleteCount] = useState<string>('');
  const [status, setStatus] = useState("");

  const startSimulation = async () => {
    try {
      const res = await axios.post("http://localhost:3000/start", { athleteCount });
      alert(res.data.message);
    } catch (error) {
      alert("Failed to start simulation");
    }
  };

  const stopSimulation = async () => {
    try {
      const res = await axios.post("http://localhost:3000/stop");
      alert(res.data.message);
    } catch (error) {
      alert("Failed to stop simulation");
    }
  };

  const adjustAthletes = async () => {
    try {
      const res = await axios.post("http://localhost:3000/adjust", { newAthleteCount: athleteCount });
      alert(res.data.message);
    } catch (error) {
      alert("Failed to adjust athletes");
    }
  };

  return (
    <div>
      <h1 className="text-xxs text-hsl-l50 font-medium text-center">Simulator Control</h1>
      <div className="flex items-center justify-center gap-x-4">
        <input type="text" id="ath" name="ath" placeholder="No. of Athletes"
          className='df-input text-sm'
          value={athleteCount} onChange={(e) => setAthleteCount(e.target.value)} autoComplete="off" />

        <button type="button" onClick={adjustAthletes}
          className="bg-cyan-500 hover:bg-cyan-600 p-1 rounded-md flex justify-center items-center mr-8">
          <IconGeneral type="sync" className="fill-cyan-200" />
        </button>

        <button type="button" onClick={startSimulation}
          className="bg-emerald-600  hover:bg-emerald-500 p-1 rounded-md flex justify-center items-center">
          <IconGeneral type="start" className="fill-emerald-300" />
        </button>
        <button type="button" onClick={stopSimulation}
          className="bg-rose-500 hover:bg-rose-600 p-1 rounded-md flex justify-center items-center">
          <IconGeneral type="stop" className="fill-rose-400" />
        </button>

      </div>
    </div>
  );
};

export default SimulatorControl;

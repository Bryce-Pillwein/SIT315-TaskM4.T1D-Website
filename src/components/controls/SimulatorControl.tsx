// Simulator Controls tsx

"use client";

import { useState } from "react";
import IconGeneral from "../layout/IconGeneral";
import mqtt from "mqtt";

const SimulatorControl = () => {
  const [athleteCount, setAthleteCount] = useState<string>('');
  const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

  const startSimulation = () => {
    // Publish the athleteCount to the start topic for all containers
    client.publish('simulation/start', String(athleteCount), { qos: 0 }, (error) => {
      if (error) {
        console.error('Failed to publish start message: ', error);
      } else {
        console.log('Published start message to all containers');
      }
    });
  };

  // Function to stop the simulation for all containers
  const stopSimulation = () => {
    // Publish a stop message to the stop topic for all containers
    client.publish('simulation/stop', '', { qos: 0 }, (error) => {
      if (error) {
        console.error('Failed to publish stop message: ', error);
      } else {
        console.log('Published stop message to all containers');
      }
    });
  };


  return (
    <div>
      <h1 className="text-xxs text-hsl-l50 font-medium text-center">Simulator Control</h1>
      <div className="flex items-center justify-center gap-x-4">
        <input type="text" id="ath" name="ath" placeholder="No. of Athletes"
          className='df-input text-sm'
          value={athleteCount} onChange={(e) => setAthleteCount(e.target.value)} autoComplete="off" />

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

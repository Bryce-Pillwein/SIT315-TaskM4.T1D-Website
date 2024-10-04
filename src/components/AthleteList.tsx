// Athlete List tsx

"use client";

import { useAthleteDataContext } from "./providers/AthleteDataProvider";


const AthleteList = () => {
  const { athlete, setSelectedAthlete } = useAthleteDataContext();

  return (
    <div className="bg-hsl-l100 shadow-sm rounded-lg border border-hsl-l95 py-8 px-4 h-full">
      <h2 className="font-semibold text-center mb-4">Select an Athlete</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 justify-center items-center">
        {athlete.map((ath) => (
          <div key={ath.id} onClick={() => setSelectedAthlete(ath)}
            className="group cursor-pointer text-center bg-hsl-l98 py-2 px-4 shadow-sm rounded-lg border border-hsl-l95">
            <p className="group-hover:text-mb-pink font-medium text-sm">{ath.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AthleteList;

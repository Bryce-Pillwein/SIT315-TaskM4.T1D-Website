// Athlete Details tsx

import { useEffect, useState } from "react";
import { useAthleteDataContext } from "./providers/AthleteDataProvider";
import { AthleteData } from "@/types/AthleteData";
import IconGeneral from "./layout/IconGeneral";



const AthleteDetails = () => {
  const { selectedAthlete, latestData } = useAthleteDataContext();
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [pace, setPace] = useState<number | null>(null);


  // Function to calculate pace in minutes per kilometer
  const calculatePace = (startTime: string, totalDistance: number) => {
    const currentTime = new Date();
    const start = new Date(startTime);

    // Time difference in minutes
    const timeDiffInMinutes = (currentTime.getTime() - start.getTime()) / (1000 * 60);

    // Calculate pace (in minutes per kilometer)
    return totalDistance > 0 ? timeDiffInMinutes / (totalDistance / 1000) : 0;
  };

  useEffect(() => {
    if (selectedAthlete && latestData[selectedAthlete.id]) {
      const athleteData = latestData[selectedAthlete.id];
      setAthlete(athleteData);

      // Calculate pace based on startTime and totalDistance
      if (athleteData?.startTime && athleteData.totalDistance) {
        const calculatedPace = calculatePace(athleteData.startTime, athleteData.totalDistance);
        setPace(Math.round(calculatedPace * 100) / 100); // Round to 2 decimal places
      }
    }
  }, [selectedAthlete, latestData]);


  return (
    <div className="bg-hsl-l100 shadow-sm rounded-lg border border-hsl-l95 py-8 px-4 h-full">

      <h2 className="text-center font-semibold mb-4">Athlete Details</h2>

      {athlete ? (
        <div className="flex flex-col justify-center h-[95%]">
          <p className="text-center font-semibold text-2xl">{athlete.name}</p>
          <div className="flex gap-x-8 justify-center mb-4">
            <p className="text-hsl-l50 text-sm">Age: {athlete.age}</p>
            <p className="text-hsl-l50 text-sm">Sex: {athlete.gender}</p>
          </div>

          {/* Pace */}
          <div className="text-center my-8">
            <p className="text-4xl font-sdisplay font-bold">{pace ? pace.toFixed(2) : 'N/A'} min/km</p>
          </div>

          {/* Heart Rate */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-x-2">
              <IconGeneral type="heart-rate" className="fill-hsl-l30" />
              <p className="text-hsl-l50">Heart Rate (BPM)</p>
            </div>
            <p className="text-2xl font-sdisplay font-bold">{athlete.heartRate.toFixed(0)}</p>
          </div>

          {/* Total Distance */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-x-2">
              <IconGeneral type="distance" className="fill-hsl-l30" />
              <p className="text-hsl-l50">Distance (m)</p>
            </div>
            <p className="text-2xl font-sdisplay font-bold">{athlete.totalDistance.toFixed(0)}</p>
          </div>

          {/* Elevation */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-x-2">
              <IconGeneral type="elevation" className="fill-hsl-l30" />
              <p className="text-hsl-l50">Elevation (m)</p>
            </div>
            <p className="text-2xl font-sdisplay font-bold">{athlete.elevationGain}</p>
          </div>

          {/* Calories Burned */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-x-2">
              <IconGeneral type="burned" className="fill-hsl-l30" />
              <p className="text-hsl-l50">Calories (kcal)</p>
            </div>
            <p className="text-2xl font-sdisplay font-bold">{athlete.totalCalories.toFixed(1)}</p>
          </div>

          <p className="text-hsl-l50 text-xs mt-auto">Last Update </p>
          <p className="text-hsl-l50 text-xs">{new Date(athlete.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-center text-sm text-hsl-l50">Choose and Athlete to View Data</p>
      )}
    </div>
  );
};

export default AthleteDetails;

// Charts tsx

"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { AthleteData } from "../types/AthleteData";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useAthleteDataContext } from './providers/AthleteDataProvider';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Charts = () => {
  const { selectedAthlete, historicalData, loading } = useAthleteDataContext();


  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-hsl-l50 text-sm">Loading athlete data...</p>
      </div>
    )
  };

  if (!selectedAthlete || !historicalData[selectedAthlete.id]) {
    return (
      <div className="py-8 text-center">
        <p className="text-hsl-l50 text-sm">Select an athlete to view data.</p>
      </div>
    )
  };

  const athleteHistory = historicalData[selectedAthlete.id];

  // Function to generate data for Chart.js
  const generateChartData = (label: string, dataKey: keyof AthleteData) => {
    const labels = athleteHistory.map((data: any) =>
      new Date(data.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    );
    const data = athleteHistory.map((data: any) => data[dataKey] as number);

    return {
      labels,
      datasets: [
        {
          label,
          data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  // Chart data for heart rate, elevation gain, and total distance
  const heartRateData = generateChartData('Heart Rate (BPM)', 'heartRate');
  const elevationGainData = generateChartData('Elevation Gain (m)', 'elevationGain');
  const totalDistanceData = generateChartData('Total Distance (m)', 'totalDistance');

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-center">{selectedAthlete.name}</h2>
      <p className="text-sm text-hsl-l50 text-center mb-4">Performance</p>


      <div className='grid grid-cols-3 gap-x-4'>
        {/* Heart Rate Chart */}
        <div className='bg-hsl-l100 p-4 rounded-md shadow-sm border border-hsl-l95'>
          <h3 className="text-center font-semibold text-sm">Heart Rate Over Time</h3>
          <Line data={heartRateData} />
        </div>

        {/* Total Distance Chart */}
        <div className='bg-hsl-l100 p-4 rounded-md shadow-sm border border-hsl-l95'>
          <h3 className="text-center font-semibold text-sm">Total Distance Over Time</h3>
          <Line data={totalDistanceData} />
        </div>

        {/* Elevation Gain Chart */}
        <div className='bg-hsl-l100 p-4 rounded-md shadow-sm border border-hsl-l95'>
          <h3 className="text-center font-semibold text-sm">Elevation Gain Over Time</h3>
          <Line data={elevationGainData} />
        </div>
      </div>
    </div>
  );
};

export default Charts;

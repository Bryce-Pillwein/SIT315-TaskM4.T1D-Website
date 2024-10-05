// Monitor

"use client";

import mqtt from "mqtt";
import { useEffect, useState } from "react";
import IconGeneral from "../layout/IconGeneral";

interface Metric {
  containerId: string;
  athleteCount: number;
  startIndex: number;
  assignedAthletes: string[];
  timestamp: string;
}

const Monitor = () => {
  const [metrics, setMetrics] = useState<Record<string, Metric>>({});

  useEffect(() => {
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("container/+/metrics");
    });

    client.on("message", (topic, message) => {
      const metric = JSON.parse(message.toString()) as Metric;
      console.log(`Received metric from ${metric.containerId}:`, metric);

      // Update the state with the most recent metric for each container
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metric.containerId]: metric, // Update or add the latest metric for the containerId
      }));
    });

    return () => {
      client.end(); // Clean up the MQTT client
    };
  }, []);

  const metricsArray = Object.values(metrics); // Convert the object to an array for rendering

  // Handle Empty Data State
  if (!metricsArray.length) return <p>No Metrics Available</p>;

  return (
    <div className="my-8">
      <h1 className="text-2xl font-bold text-center">Container Metrics</h1>

      <div className="grid grid-cols-4 gap-x-4">
        {metricsArray.map((metric, idx) => (
          <div key={idx} className="bg-hsl-l100 shadow-sm rounded-lg border border-hsl-l95 py-4 px-4">
            <h3 className="text-center font-medium mb-2">Simulator {metric.containerId}</h3>


            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-x-2">
                <IconGeneral type="athlete" className="fill-hsl-l30" />
                <p className="text-hsl-l50">Total Count in Process</p>
              </div>
              <p className="font-bold">{metric.athleteCount}</p>
            </div>

            <div className=" mb-4">
              <div className="flex items-center gap-x-2">
                <IconGeneral type="bolt" className="fill-hsl-l30" />
                <p className="text-hsl-l50">Athlete ID's</p>
              </div>
              <p className="font-medium font-montserrat text-sm">{metric.assignedAthletes.map((athlete: string) => athlete.replace("athlete-", "")).join(", ")}</p>
            </div>

            {/* <p>Start Index: {metric.startIndex}</p> */}

            <p className="text-hsl-l50 text-xs mt-auto">Last Update </p>
            <p className="text-hsl-l50 text-xs">{new Date(metric.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monitor;

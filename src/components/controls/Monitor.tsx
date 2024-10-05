// Monitor

"use client";

import mqtt from "mqtt";
import { useEffect, useState } from "react";
import IconGeneral from "../layout/IconGeneral";

interface MetricSimulator {
  containerId: string;
  athleteCount: number;
  startIndex: number;
  assignedAthletes: string[];
  timestamp: string;
}

interface MetricProcessor {
  containerId: string;
  processedMessagesCount: number;
  active: boolean;
  timestamp: string;
}

const Monitor = () => {
  const [metricsSim, setMetricsSim] = useState<Record<string, MetricSimulator>>({});
  const [metricsProc, setMetricsProc] = useState<Record<string, MetricProcessor>>({});

  useEffect(() => {
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("simulator/+/metrics");
      client.subscribe("processor/+/metrics");
    });

    client.on("message", (topic, message) => {
      const messageString = message.toString();

      if (topic.startsWith("simulator/")) {
        const metric = JSON.parse(messageString) as MetricSimulator;
        // console.log(`Received simulator metric from ${metric.containerId}:`, metric);

        // Update the state with the most recent metric for each container
        setMetricsSim((prevMetrics) => ({
          ...prevMetrics,
          [metric.containerId]: metric, // Update or add the latest metric for the containerId
        }));
      } else if (topic.startsWith("processor/")) {
        const metric = JSON.parse(messageString) as MetricProcessor;
        // console.log(`Received processor metric from ${metric.containerId}:`, metric);

        // Update the state with the most recent metric for each container
        setMetricsProc((prevMetrics) => ({
          ...prevMetrics,
          [metric.containerId]: {
            ...metric,
            active: true
          }, // Update or add the latest metric for the containerId
        }));
      }
    });

    return () => {
      client.end(); // Clean up the MQTT client
    };
  }, []);


  // Check every second for inactive processors
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();

      setMetricsProc((prevMetrics) => {
        const updatedMetrics = { ...prevMetrics };

        Object.keys(updatedMetrics).forEach((key) => {
          const lastTimestamp = new Date(updatedMetrics[key].timestamp).getTime();

          // If more than 10 seconds have passed since the last message, mark the processor as inactive
          if (currentTime - lastTimestamp > 10000) {
            updatedMetrics[key].active = false;
          }
        });

        return updatedMetrics;
      });
    }, 10000); // Check every second

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="mt-16 mb-8">

      {/* Simulator Container Metrics  */}
      <h1 className="text-2xl font-bold text-center">Simulator Metrics</h1>
      {metricsSim && Object.keys(metricsSim).length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4">
          {Object.keys(metricsSim).map((key, idx) => (
            <div key={idx} className="bg-hsl-l100 shadow-sm rounded-lg border border-hsl-l95 py-4 px-4">
              <h3 className="text-center font-medium mb-2">Simulator {metricsSim[key].containerId}</h3>


              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-x-2">
                  <IconGeneral type="athlete" className="fill-hsl-l30" />
                  <p className="text-hsl-l50">Athletes in Simulation</p>
                </div>
                <p className="font-bold">{metricsSim[key].athleteCount}</p>
              </div>

              <div className=" mb-4">
                <div className="flex items-center gap-x-2">
                  <IconGeneral type="profile" className="fill-hsl-l30" />
                  <p className="text-hsl-l50">Athlete ID's</p>
                </div>
                <p className="font-medium font-montserrat text-sm">{metricsSim[key].assignedAthletes.map((athlete: string) => athlete.replace("athlete-", "")).join(", ")}</p>
              </div>

              <p className="text-hsl-l50 text-xs mt-auto">Last Update </p>
              <p className="text-hsl-l50 text-xs">{new Date(metricsSim[key].timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-hsl-l50 text-sm text-center">No Metrics to View.</p>
      )}

      {/* Processor Container Metrics  */}
      <h1 className="text-2xl font-bold text-center mt-8">Processor Metrics</h1>
      {metricsProc && Object.keys(metricsProc).length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4">
          {Object.keys(metricsProc).map((key, idx) => (
            <div key={idx} className="bg-hsl-l100 shadow-sm rounded-lg border border-hsl-l95 py-4 px-4">
              <h3 className="text-center font-medium mb-2">Processor {metricsProc[key].containerId}</h3>


              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-x-2">
                  <IconGeneral type="arrow-right" className="fill-hsl-l30" size={20} />
                  <p className="text-hsl-l50">Messages Processed</p>
                </div>
                <p className="font-bold">{metricsProc[key].processedMessagesCount}</p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-x-2">
                  <IconGeneral type="bolt" className="fill-hsl-l30" />
                  <p className="text-hsl-l50">Active Status</p>
                </div>
                <p className="font-bold">{metricsProc[key].active ? 'Active' : 'Inactive'}</p>
              </div>

              <p className="text-hsl-l50 text-xs mt-auto">Last Update </p>
              <p className="text-hsl-l50 text-xs">{new Date(metricsProc[key].timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-hsl-l50 text-sm text-center">No Metrics to View.</p>
      )}


    </div>
  );
};

export default Monitor;

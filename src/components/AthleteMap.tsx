// Athlete Map tsx

"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAthleteDataContext } from "./providers/AthleteDataProvider";
import { AthleteLocation } from "@/types/AthleteLocation";

// Utility to generate random colors for markers
const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const AthleteMap = () => {
  const { athlete } = useAthleteDataContext();  // Get athlete data from the provider
  const [athleteLocations, setAthleteLocations] = useState<{ [athleteId: string]: AthleteLocation }>({});

  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    // Subscribe to all athlete GPS topics using the wildcard
    const gpsTopic = `athlete/+/gps`;

    client.on("connect", () => {
      console.log("Connected to MQTT broker for GPS data");
      client.subscribe(gpsTopic, (err) => {
        if (err) {
          console.error("Failed to subscribe to GPS topic:", err);
        }
      });
    });

    // Handle incoming GPS messages
    client.on("message", (topic, message) => {
      try {
        const gpsData = JSON.parse(message.toString());
        const athleteId = topic.split('/')[1]; // Extract athlete ID from the topic

        // Update the location for the specific athlete
        setAthleteLocations((prevLocations) => ({
          ...prevLocations,
          [athleteId]: {
            lat: gpsData.lat,
            lon: gpsData.lon,
            timestamp: gpsData.timestamp,
          },
        }));

        console.log(`Received GPS data for ${athleteId}:`, gpsData);
      } catch (err) {
        console.error("Error parsing GPS message:", err);
      }
    });

    // Clean up the MQTT connection when the component unmounts
    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="bg-hsl-l100 p-4 rounded-md shadow-md border border-hsl-l95">

      {/* Map Container */}
      <MapContainer center={[-37.84986, 145.11481]} zoom={13} style={{ height: '500px', width: '100%' }}>
        {/* Tile layer for the map (using OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render a marker for each athlete */}
        {Object.keys(athleteLocations).map((athleteId) => {
          const athleteData = athlete.find((a) => a.id === athleteId);
          const markerColor = generateRandomColor(); // Generate a random color for each marker

          const customIcon = new L.Icon({
            iconUrl: `https://via.placeholder.com/25/${markerColor.slice(1)}/FFFFFF?text=%E2%80%A2`, // Placeholder with random color
            iconSize: [25, 25],
          });

          return (
            <Marker
              key={athleteId}
              position={[athleteLocations[athleteId].lat, athleteLocations[athleteId].lon]}
              icon={customIcon}  // Use a different color for each athlete
            >
              <Popup>
                <h3 className="text-xs font-bold">{athleteData ? athleteData.name : athleteId}</h3>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default AthleteMap;
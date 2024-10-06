// Athlete Map tsx

"use client";

import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAthleteDataContext } from "./providers/AthleteDataProvider";
import { AthleteLocation } from "@/types/AthleteLocation";

// Utility function to generate random colors
const generateRandomColor = (): string => {
  const colors = ['#FF1AA7', '#FFE900', '#EB5929', '#00FFF7', '#E46296', '#000000'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// SVG Icon
const getSvgIcon = (color: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="${color}"><path d="M520-80v-200l-84-80-31 138q-4 16-17.5 24.5T358-192l-198-40q-17-3-26-17t-6-31q3-17 17-26.5t31-5.5l152 32 64-324-72 28v96q0 17-11.5 28.5T280-440q-17 0-28.5-11.5T240-480v-122q0-12 6.5-21.5T264-638l134-58q35-15 51.5-19.5T480-720q21 0 39 11t29 29l40 64q21 34 54.5 59t77.5 33q17 3 28.5 15t11.5 29q0 17-11.5 28t-27.5 9q-54-8-101-33.5T540-540l-24 120 72 68q6 6 9 13.5t3 15.5v243q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80Zm20-660q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/></svg>
`;


const AthleteMap = () => {
  const { athlete } = useAthleteDataContext();  // Get athlete data from the provider
  const [athleteLocations, setAthleteLocations] = useState<{ [athleteId: string]: AthleteLocation }>({});
  const [athleteColors, setAthleteColors] = useState<{ [athleteId: string]: string }>({}); // Store colors
  const mapRef = useRef<any>(null);


  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    // Subscribe to all athlete GPS topics using the wildcard
    const gpsTopic = `athlete/+/gps`;

    client.on("connect", () => {
      console.log("Connected to MQTT broker for GPS data");
      client.subscribe(gpsTopic, (err) => {
        if (err) {
          console.error("Failed to subscribe to GPS topic");
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

        // Generate and store a color for the athlete only once
        setAthleteColors((prevColors) => {
          if (!prevColors[athleteId]) {
            return { ...prevColors, [athleteId]: generateRandomColor() };
          }
          return prevColors;
        });

      } catch (err) {
        console.error("Error parsing GPS message:", err);
      }
    });

    // Clean up the MQTT connection when the component unmounts
    return () => {
      client.end();
    };
  }, []);

  // Effect to remove athletes who have not received updates for a specified time
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      setAthleteLocations((prevLocations) => {
        const updatedLocations = { ...prevLocations };

        // Remove athletes whose last update was more than 30 seconds ago
        Object.keys(updatedLocations).forEach((athleteId) => {
          const athleteTimestamp = new Date(updatedLocations[athleteId].timestamp).getTime();
          if (currentTime - athleteTimestamp > 10000) { // 10 seconds threshold
            delete updatedLocations[athleteId];
          }
        });

        return updatedLocations;
      });
    }, 10000); // Run cleanup every 10 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Handle Map & Cleanup
   */
  useEffect(() => {
    if (!mapRef.current) {
      console.log("Map initialized");
      // The mapRef will hold the reference to the map
      mapRef.current = true;
    }

    return () => {
      // const map = document.getElementById("map-container");
      // console.log(map);
      // if (map) {
      //   map.remove();
      // }
    }
  }, []);

  return (
    <div className="bg-hsl-l100 p-4 rounded-md shadow-sm border border-hsl-l95 h-full">
      <MapContainer center={[-37.84986, 145.11481]} zoom={13} style={{ width: "100%", height: "100%" }}
        ref={mapRef} id="map-container">

        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.keys(athleteLocations).map((athleteId) => {
          const athleteData = athlete.find((a) => a.id === athleteId);
          const markerColor = athleteColors[athleteId];

          // Customize your icon with the athlete's color
          const customIcon = L.divIcon({
            html: getSvgIcon(markerColor),
            iconSize: [30, 30],
            className: `custom-marker-${athleteId}`,
          });

          return (
            <Marker
              key={athleteId}
              position={[athleteLocations[athleteId].lat, athleteLocations[athleteId].lon]}
              icon={customIcon}
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
};

export default AthleteMap;
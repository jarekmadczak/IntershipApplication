import { useState, useEffect, useRef } from "react";

export default function Map({ setLatitude, setLongitude, centerLocation }) {
  const mapRef = useRef(null);
  const [location, setLocation] = useState({ latitude: 50.0647, longitude: 19.945 });
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    const loadLeaflet = async () => {
      try {
        const leaflet = (await import("leaflet")).default;

        if (map) return;

        const newMap = leaflet.map(mapRef.current).setView([location.latitude, location.longitude], 13);

        leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(newMap);

        newMap.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setLatitude(lat);
          setLongitude(lng);
        });

        if (centerLocation) {
          newMap.setView([centerLocation.latitude, centerLocation.longitude], 13);
        }

        setMap(newMap);

        return () => {
          newMap.remove();
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    if (centerLocation) {
        map.setView([centerLocation.latitude, centerLocation.longitude], 14);
      }
    loadLeaflet();
  }, [isClient, location, centerLocation, setLatitude, setLongitude, map]);

 

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isClient ? (
        <div
          ref={mapRef}
          style={{ height: "300px", width: "100%" }}
          className="rounded-lg shadow-md"
        ></div>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}

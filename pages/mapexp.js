import { useEffect, useState, useRef } from "react";
import leaflet from "leaflet";

export default function Map({ setLatitude, setLongitude, centerLocation }) {
  const mapRef = useRef(null); // Reference for the map container
  const [location, setLocation] = useState({ latitude: 50.0647, longitude: 19.945 }); // Default location set to Kraków

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map, centering on Kraków initially
    const map = leaflet.map(mapRef.current).setView([location.latitude, location.longitude], 13);

    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        
      })
      .addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLatitude(lat);  // Update latitude state
      setLongitude(lng); // Update longitude state
    });

    if (centerLocation) {
      map.setView([centerLocation.latitude, centerLocation.longitude], 13);
 
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [location, centerLocation, setLatitude, setLongitude]); 

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        ref={mapRef}
        style={{ height: "300px", width: "100%" }} 
        className="rounded-lg shadow-md" 
      ></div>
    </div>
  );
}

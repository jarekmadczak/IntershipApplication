import { useState } from 'react';
import { fetchWeather } from './api/getData'

export default function Home() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherDataHourly, setWeatherDataHourly] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxTemp, Maxdaly] = useState(0);
  const [times, Times] = useState(null);
  const [minTemp, Mindaly] = useState(0);
  const handleFetchWeather = async () => {
    if (!latitude || !longitude) {
      setError('Please provide latitude and longitude.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(latitude, longitude); 
      const daysHoursStart = {
        day1: { start: 0, end: 24 },
        day2: { start: 24, end: 48 },
        day3: { start: 48, end: 72 },
        day4: { start: 72, end: 96 },
        day5: { start: 96, end: 120 },
        day6: { start: 120, end: 144 },
        day7: { start: 144, end: 168 }
      }; 


      let temperaturesMax = []
      let temperaturesMin = []
   
      for(var e in daysHoursStart){
    
        let temperatures = data.hourly.temperature_2m.slice(daysHoursStart[e].start,daysHoursStart[e].end);
        temperaturesMax.push(Math.max(...temperatures))
        temperaturesMin.push(Math.min(...temperatures))
      
      };
    
      Maxdaly(temperaturesMax)
      Mindaly(temperaturesMin)
    
      setWeatherDataHourly(data.hourly.temperature_2m); 
      setWeatherData(data.hourly.weathercode)
      Times(data.hourly.time)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPage = () => {
    setLatitude('');
    setLongitude('');
    setWeatherDataHourly(null);
    setError(null);
  };
 

  return (
    <div className="bg-blue-900 w-screen h-full min-h-screen flex flex-col items-center justify-center">
      <div className="text-center w-full">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Weather APPLICATION
        </h1>
      </div>

      <div className="w-full max-w-md text-center">
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="mb-2 px-4 py-2 w-full rounded border border-gray-300"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="mb-4 px-4 py-2 w-full rounded border border-gray-300"
        />
        <button
          onClick={handleFetchWeather}
          className="mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Get Weather
        </button>
        <button
          onClick={refreshPage}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Refresh
        </button>
      </div>

      <div className="w-full max-w mt-4 text-center text-white">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {weatherData && (
            <div className="grid grid-cols-4 content-normal text-center">
              {minTemp.map((temp, index) => {
                const startIndex = index * 24;
                const endIndex = (index + 1) * 24;
                const dailyTemps = weatherDataHourly.slice(startIndex, endIndex); // Slice the `weatherDataHourly` array to get the hourly temperatures for the current day.
                
                return (
                  <div key={index} className="bg-gray-100 p-4 text-center rounded shadow-md m-3 text-black">
                    <h3 className="font-bold">{times[startIndex].slice(0, 10)}</h3>
                    <p>Max Temp: {maxTemp[index]}°C</p>
                    <p>Min Temp: {minTemp[index]}°C</p>
                    <div className="mt-2">
                      <ul>
                        {dailyTemps.map((temp, hourIndex) => {
                          const time = times[startIndex + hourIndex];
                          return (
                            <li key={hourIndex}>
                              Hour {time.slice(11, 16)}: {temp}°C
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
      </div>
    );

}

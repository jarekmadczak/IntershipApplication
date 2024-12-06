import { useState } from 'react';
import { fetchWeather } from './api/FirstEndPoint'
import { fetchWeeklySummary } from './api/SecondEndPoint'
import L from 'leaflet';
export default function Home() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherDataHourly, setWeatherDataHourly] = useState(null);
  const [weathercode, setWeatherCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxTemp, Maxdaly] = useState([]);
  const [times, Times] = useState(null);
  const [minTemp, Mindaly] = useState([]);
  const [sunshine_duration, Sunshine_duration] = useState([]);
  const [avgWeeklyPressure, AvgWeeklyPressure] = useState(null);
  const [avgWeekSunshineDuration, AvgWeekSunshineDuration] = useState(null);
  const [maxWeekTemperature, MaxWeekTemperature] = useState(null);
  const [minWeekTemperature, MinWeekTemperature] = useState(null);
  const [weekWeatherSummary, WeekWeatherSummary] = useState(null);


  
  const handleFetchWeather = async () => {
    if (!latitude || !longitude) {
      setError('Please provide latitude and longitude.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const weeklydata = await fetchWeeklySummary(latitude,longitude)
      const data = await fetchWeather(latitude, longitude); 
      
      //first api
      setWeatherDataHourly(data.rawdata.hourly.temperature_2m); 
      setWeatherCode(data.weatherDescription)
      Times(data.rawdata.hourly.time)
      Sunshine_duration(data.dailyEnergy)
      Mindaly(data.temperaturesMin)
      Maxdaly(data.temperaturesMax)
      //second api 
      
      AvgWeeklyPressure(weeklydata.avgWeeklyPressure)
      AvgWeekSunshineDuration(weeklydata.avgSunshineDuration)
      MaxWeekTemperature(weeklydata.maxTemperature)
      MinWeekTemperature(weeklydata.minTemperature)
      WeekWeatherSummary(weeklydata.weatherSummary)
      

     
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
        <div className="w-full h-96 mt-4" id="map"></div>
      </div>  
      <div className=" content-normal text-center ">
      {loading && <p className='text-white'>Loading Weeakly report</p>}
        {error && <p className="text-red-500">{error}</p>}
        {maxWeekTemperature && (
     <div className="w-full max-w text-center text-white">
              <h2 className="font-bold">Weekly Output:</h2>
                  <div>
                    <h3>Pressure: {avgWeeklyPressure}</h3>
                    <h3>Average Sunshine Duration: {avgWeekSunshineDuration} hours</h3>
                    <h3>Max Temperature: {maxWeekTemperature}°C</h3>
                    <h3>Min Temperature: {minWeekTemperature}°C</h3>
                    <h3>Weather Summary: {weekWeatherSummary}</h3>
                  </div>

                  </div>
                  )}
            </div>
      <div className="w-full max-w mt-4 text-center text-white">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {weatherDataHourly && (
            <div className="grid grid-cols-4 content-normal text-center">
              
              {minTemp.map((temp, index) => {
                const startIndex = index * 24;
                const endIndex = (index + 1) * 24;
                const dailyTemps = weatherDataHourly.slice(startIndex, endIndex); // Slice the `weatherDataHourly` array to get the hourly temperatures for the current day.
                
                return (
                  <div key={index} className="bg-gray-100 p-4 text-center rounded shadow-md m-3 text-black">
                    <h3 className="font-bold">{times[startIndex].slice(0, 10)}</h3>
                    <h3 className="font-bold">{sunshine_duration[index]}kWh</h3>
                    <p>Max Temp: {maxTemp[index]}°C</p>
                    <p>Min Temp: {minTemp[index]}°C</p>
                    <div className="mt-2">
                      <ul>
                        {dailyTemps.map((temp, hourIndex) => {
                          const time = times[startIndex + hourIndex];
                          const weatherCod = weathercode[startIndex + hourIndex];
                          return (
                            <li key={hourIndex}>
                              Hour {time.slice(11, 16)}: {temp}°C {weatherCod}
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

import { useState } from 'react';
import { fetchWeather } from './api/FirstEndPoint'
import { fetchWeeklySummary } from './api/SecondEndPoint'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudSun, faCloud, faArrowDown, faArrowUp, faSnowflake, faCloudRain, faBolt } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import { Line } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const Map = dynamic(() => import('./mapexp'), { ssr: false });





const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB'); 
};

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
  const [centerLocation, setCenterLocation] = useState(null); 
  const [isLightMode, setIsLightMode] = useState(false);
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
      
      setCenterLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
     
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
  setWeatherCode(null);
  Times(null);
  Sunshine_duration([]);
  Mindaly([]);
  Maxdaly([]);
  AvgWeeklyPressure(null);
  AvgWeekSunshineDuration(null);
  MaxWeekTemperature(null);
  MinWeekTemperature(null);
  WeekWeatherSummary(null);
  setError(null); 
};

const getChartData = (index) => {
  const startIndex = index * 24;
  const endIndex = (index + 1) * 24;
  const dailyTemps = weatherDataHourly.slice(startIndex, endIndex);

  return {
    labels: times.slice(startIndex, endIndex).map((time) => time.slice(11, 16)), 
    datasets: [
      {
        label: `Temperature for Day ${index + 1}`,
        data: dailyTemps, 
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        fill: true, 
        tension: 0.4, 
      },
    ],
  };
};

//icons
const getWeatherIcon = (description) => {
  switch (description.toLowerCase()) {
    case "clear sky":
    case "clear":
      return <FontAwesomeIcon icon={faSun} className="text-yellow-400" />; 
    case "mainly clear":
      return <FontAwesomeIcon icon={faSun} className="text-yellow-300" />; 
    case "partly cloudy":
      return <FontAwesomeIcon icon={faCloudSun} className="text-yellow-500" />; 
    case "overcast":
      return <FontAwesomeIcon icon={faCloud} className="text-gray-600" />; 
    case "fog":
      return <FontAwesomeIcon icon={faCloud} className="text-gray-400" />; 
    case "depositing rime fog":
      return <FontAwesomeIcon icon={faCloud} className="text-gray-600" />;
    case "drizzle: light":
    case "drizzle: moderate":
    case "drizzle: dense intensity":
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-500" />; 
    case "freezing drizzle: light":
    case "freezing drizzle: dense intensity":
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />; 
    case "rain: slight":
    case "rain: moderate":
    case "rain: heavy intensity":
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-600" />;
    case "freezing rain: light":
    case "freezing rain: heavy intensity":
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-700" />; 
    case "snow fall: slight":
    case "snow fall: moderate":
    case "snow fall: heavy intensity":
      return <FontAwesomeIcon icon={faSnowflake} className="text-white" />; 
    case "snow grains":
      return <FontAwesomeIcon icon={faSnowflake} className="text-white" />; 
    case "rain showers: slight":
    case "rain showers: moderate":
    case "rain showers: violent":
    case "rainy":
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-500" />; 
    case "snow showers: slight":
    case "snow showers: heavy":
    case "snowy":
      return <FontAwesomeIcon icon={faSnowflake} className="text-white" />; 
    case "thunderstorm: slight or moderate":
    case "thunderstorm with slight hail":
    case "thunderstorm with heavy hail":
      return <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />; 
    default:
      return <FontAwesomeIcon icon={faCloud} className="text-gray-500" />; 
  }
};

const toggleMode = () => {
  setIsLightMode(!isLightMode);
};


return (
  <div className={`relative ${isLightMode ? 'bg-stone-400 text-gray-800' : 'bg-zinc-900 text-gray-100'} w-full min-h-screen flex flex-col items-center overflow-hidden`}>
   
   
   <button 
        onClick={toggleMode} 
        className={`absolute top-6 right-6 p-2 rounded-full ${isLightMode ? 'bg-gray-300' : 'bg-gray-600'} text-${isLightMode ? 'black' : 'white'}`}>
        {isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>
    {/* Header */}
    <h1 className="text-4xl font-bold mt-8 mb-6 text-center z-10">Weather App</h1>

    {/* Main Container */}
    <div className="relative bg-white bg-opacity-10 w-4/5 h-auto rounded-lg p-6 shadow-lg flex flex-col gap-6 z-10 overflow-auto">
      {/* Inputs and Map Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Section */}
        <div className="bg-white bg-opacity-20 w-full md:w-1/3 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold  mb-4 text-center">Enter Coordinates</h2>
          <input 
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mb-4 px-4 py-2 w-full rounded border text-black  border-gray-300"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mb-4 px-4 py-2 w-full rounded border text-black  border-gray-300"
          />
          <button
            onClick={handleFetchWeather}
            className="mb-2 px-4 py-2 w-full bg-green-500  rounded hover:bg-green-600"
          >
            Get Weather
          </button>
          <button
            onClick={refreshPage}
            className="px-4 py-2 w-full bg-red-500  rounded hover:bg-red-600"
          >
            Refresh
          </button>
        </div>

        {/* Map Section */}
        <div className="bg-white bg-opacity-20 flex-grow h-48 md:h-auto p-6 rounded-lg shadow-md flex items-center justify-center">
            <Map setLatitude={setLatitude} setLongitude={setLongitude} centerLocation={centerLocation} />
        </div>
      </div>

      <div className="bg-white bg-opacity-20 w-full p-6 rounded-lg shadow-md mt-6">
      {loading && <p className=" text-center">Loading Weekly Report...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {maxWeekTemperature && (
        <div className="text-center ">
            <h2 className="font-bold text-2xl mb-4 text-center ">Weekly Report</h2>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faArrowDown} className="text-blue-400" size="lg" />
                  <h3 className="font-medium text-lg ">Pressure: {avgWeeklyPressure} hPa</h3>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faSun} className="text-yellow-400" size="lg" />
                  <h3 className="font-medium text-lg ">Sunshine Duration: {avgWeekSunshineDuration} hrs</h3>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faArrowUp} className="text-red-400" size="lg" />
                  <h3 className="font-medium text-lg ">Max Temp: {maxWeekTemperature}°C</h3>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faArrowDown} className="text-blue-400" size="lg" />
                  <h3 className="font-medium text-lg ">Min Temp: {minWeekTemperature}°C</h3>
                </div>
                </div>
                <div className="flex items-center justify-center ">
                  <h3 className="font-medium text-lg ">
                  rainfall:
                  <p className=" font-semibold"> {weekWeatherSummary && getWeatherIcon(weekWeatherSummary)} {weekWeatherSummary}</p></h3>
                </div>
              
        </div>
      )}
    </div>
          {loading && <p className=" text-center">Loading Hourly Data...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {weatherDataHourly && (
            <div className="grid grid-cols-1 gap-6">
              {minTemp.map((temp, index) => {
                const startIndex = index * 24;
                const endIndex = (index + 1) * 24;
                const dailyTemps = weatherDataHourly.slice(startIndex, endIndex);
                return (
                  <div key={index} className="bg-gray-100 p-6 text-center rounded shadow-md m-3 text-black">
                    {/* Date in d-m-y format */}
                    <h3 className="font-bold text-xl">Date: {formatDate(times[startIndex])}</h3>
                    <div className="mt-4 flex justify-center items-center gap-2">
                      <FontAwesomeIcon icon={faBolt} className="text-yellow-500" size="lg" />
                      <span className="text-gray-600">Energy (kWh): {sunshine_duration[index]} kWh</span>
                    </div>
                    
                    <div className="flex justify-center items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faArrowUp} className="text-red-500" size="lg" />
                        <p className="text-lg font-semibold">Max Temp: {maxTemp[index]}°C</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faArrowDown} className="text-blue-500" size="lg" />
                        <p className="text-lg font-semibold">Min Temp: {minTemp[index]}°C</p>
                      </div>
                    </div>

                    {/* Line Chart */}
                    <div className="mt-4">
                      <Line data={getChartData(index)} />
                    </div>

                
                    <div className="mt-4 flex justify-center items-center gap-2">
                      {weathercode[startIndex] && getWeatherIcon(weathercode[startIndex])}
                      <p className="text-gray-600 font-semibold">{weathercode[startIndex]}</p>
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
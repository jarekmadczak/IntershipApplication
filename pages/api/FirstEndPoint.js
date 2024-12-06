
export async function fetchWeather(latitude, longitude) {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,&time=time&daily=sunshine_duration`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status}`);
  }


  const data = await response.json();
  
  
      const daysHoursStart = {
        day1: { start: 0, end: 24 },
        day2: { start: 24, end: 48 },
        day3: { start: 48, end: 72 },
        day4: { start: 72, end: 96 },
        day5: { start: 96, end: 120 },
        day6: { start: 120, end: 144 },
        day7: { start: 144, end: 168 }
      }; 

      const weatherCodeDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light",
        53: "Drizzle: Moderate",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight",
        63: "Rain: Moderate",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light",
        67: "Freezing Rain: Heavy intensity",
        71: "Snow fall: Slight",
        73: "Snow fall: Moderate",
        75: "Snow fall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight",
        81: "Rain showers: Moderate",
        82: "Rain showers: Violent",
        85: "Snow showers: Slight",
        86: "Snow showers: Heavy",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
      };


      let temperaturesMax = []
      let temperaturesMin = []
   
      //calculate a MAX?MIN temperature of day
      for(var e in daysHoursStart){
    
        let temperatures = data.hourly.temperature_2m.slice(daysHoursStart[e].start,daysHoursStart[e].end);
        temperaturesMax.push(Math.max(...temperatures))
        temperaturesMin.push(Math.min(...temperatures))
      
      };
      const weatherCode=data.hourly.weathercode
      const weatherDescription = weatherCode.map(code => weatherCodeDescriptions[code] || 'Unknown weather code');

      //calculate a dailyEnergy
      const installationPower = 2.5; // kW
      const panelEfficiency = 0.2; // 20%
      const dailyEnergy = []

      for(var e in data.daily.sunshine_duration){
        dailyEnergy.push(installationPower*panelEfficiency*parseFloat(data.daily.sunshine_duration[e]))
        
      }
      
  return {
    rawdata: data,
    temperaturesMax,
    dailyEnergy,
    temperaturesMin,
    weatherDescription}
}
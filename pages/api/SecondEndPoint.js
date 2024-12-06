export async function fetchWeeklySummary(latitude, longitude) {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
  
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,pressure_msl&daily=sunshine_duration`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }
  
    const data = await response.json();
  
    const hourlyTemperatures = data.hourly.temperature_2m;
    const hourlyWeatherCodes = data.hourly.weathercode;
    const hourlyPressures = data.hourly.pressure_msl;
    const dailySunshineDuration = data.daily.sunshine_duration;
  
    //Calculate average weekly pressure reduce solution
    const avgWeeklyPressure = (hourlyPressures.reduce((sum, pressure) => sum + pressure, 0) /hourlyPressures.length).toFixed(2);
  
    //Calculate average sunshine duration basic for solution 
    const avgSunshineDuration = (hourlyTemperatures) => {
        let sum = 0;
        for (let i = 0; i < dailySunshineDuration.length; i++) {
          sum += dailySunshineDuration[i]; 
        }
        return parseFloat(sum / dailySunshineDuration.length).toFixed(2); 
      };
    

     const maxTemperature = Math.max(...hourlyTemperatures);
     const minTemperature = Math.min(...hourlyTemperatures);
  
    
     const rainCodes = [61, 63, 65, 80, 81, 82, 96, 99]; // Rain weather codes
     const snowCodes = [71, 73, 75, 77, 85, 86]; // Snow weather codes
     const totalHours = hourlyWeatherCodes.length;

        // Count rainy days
        const rainyDaysCount = hourlyWeatherCodes.filter((code) =>
        rainCodes.includes(code)
        ).length;

        // Count snowy days
        const snowDaysCount = hourlyWeatherCodes.filter((code) =>
        snowCodes.includes(code)
        ).length;
        
    let weatherSummary;
        if (rainyDaysCount > totalHours * 0.5) {
            weatherSummary = "week with rain";
          } else if (snowDaysCount > totalHours * 0.5) {
            weatherSummary = "week with snow";
          } else {
            weatherSummary = "week without rain or snow";
          }
    
    return {
    avgWeeklyPressure,
    avgSunshineDuration,
    maxTemperature,
    minTemperature,
    weatherSummary,
  };
  }
  
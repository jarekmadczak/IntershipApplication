
export async function fetchWeather(latitude, longitude) {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&time=time`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status}`);
  }


  const data = await response.json();
  console.log(data)
  return data;
}
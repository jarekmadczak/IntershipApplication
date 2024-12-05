const URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather data from Open-Meteo API
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @param {string} [hourly='temperature_2m'] - Data type to fetch (default: temperature)
 * @returns {Promise<Object>} - Returns weather data
 */
export async function fetchWeatherData(latitude, longitude, hourly = 'temperature_2m') {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=${hourly}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}
const axios = require('axios');

async function getWeatherReport() {
  const apiKey = 'f011770e2fddf811cd25d28fdc71c2df';
  const city = 'Tashkent';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    // Обработка данных погоды и форматирование отчета
    const weatherReport = `Погода в ${city}:\nТемпература: ${weatherData.main.temp}°C\nОписание: ${weatherData.weather[0].description}`;

    return weatherReport;
  } catch (error) {
    console.error('Ошибка при получении отчета погоды:', error);
    return 'Произошла ошибка при получении отчета погоды';
  }
}

module.exports = {
    getWeatherReport
}
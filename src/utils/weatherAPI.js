const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fetchData = async (url) => {
  try {
    let res = await fetch(url);
    return res.json();
  } catch (err) {
    console.error(err);
  }
};

const icons = {
  "01": [800],
  "02": [801],
  "03": [802],
  "04": [803, 804],
  "09": [300, 301, 302, 310, 311, 312, 313, 314, 321, 520, 521, 522, 531],
  10: [500, 501, 502, 503, 504],
  11: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  13: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622, 511],
  50: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
};
const getIcon = (code, time, sunrise, sunset) => {
  let num;
  let letter;
  for (let [key, value] of Object.entries(icons)) {
    if (value.includes(code)) num = key;
  }
  if (time > sunrise && time < sunset) letter = "d";
  else letter = "n";

  return num + letter;
};

const getWeather = async (units, lat, lon, city = "") => {
  const weatherUrl = (() => {
    if (city !== "")
      return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${process.env.OPENWEATHER_KEY}`;
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_KEY}`;
  })();

  // console.log(weatherUrl);

  const weatherData = await fetchData(weatherUrl);

  const code = weatherData.weather[0].id;
  const today = new Date();
  const time = today.toUTCString().slice(17, 25);
  const sunrise = new Date(weatherData.sys.sunrise * 1000)
    .toISOString()
    .slice(11, 18);
  const sunset = new Date(weatherData.sys.sunset * 1000)
    .toISOString()
    .slice(11, 18);

  const icon = getIcon(code, time, sunrise, sunset);

  const weather = {
    type: weatherData.weather[0].main,
    description: weatherData.weather[0].description,
    temp: weatherData.main.temp,
    feels_like: weatherData.main.feels_like,
    temp_min: weatherData.main.temp_min,
    temp_max: weatherData.main.temp_max,
    pressure: weatherData.main.pressure,
    humidity: weatherData.main.humidity,
    wind_speed: weatherData.wind.speed,
    wind_degrees: weatherData.wind.deg,
    sunrise: sunrise,
    sunset: sunset,
    icon: `http://openweathermap.org/img/wn/${icon}@2x.png`,
  };

  return weather;
};

module.exports = getWeather;

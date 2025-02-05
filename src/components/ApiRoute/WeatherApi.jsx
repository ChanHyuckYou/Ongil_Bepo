import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: "1c4c23c13f34e7ad256e2a5f0a2f14f7", // 환경 변수 사용
    units: "metric",
    lang: "kr",
  },
});

const WeatherApi = {
  async getCurrentWeather(lat, lon) {
    const response = await httpClient.get("weather", { params: { lat, lon } });
    return response.data;
  },

  async getForecast(lat, lon) {
    const response = await httpClient.get("forecast", { params: { lat, lon } });
    return response.data;
  },

  async getReverseGeo(lat, lon) {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
      params: {
        lat, lon, limit: 5, lang: "kr",
        appid: "1c4c23c13f34e7ad256e2a5f0a2f14f7", // 환경 변수 적용
      },
    });
    return response.data[0].local_names?.['ko'] || response.data[0].name;
  },

  async searchCities(query) {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
      params: {
        q: query,
        limit: 5,
        appid: "1c4c23c13f34e7ad256e2a5f0a2f14f7", // 환경 변수 사용
      },
    });
    return response.data;
  },
};

export default WeatherApi;

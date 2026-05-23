import request from "request";

const countryCapital = (
  name: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(`Countries API is not available: ${error.message}`, undefined);
    } else if (response.body.features.length === 0) {
      callback(`Countries API error: no name found`, undefined);
    } else {
      callback(undefined, response);
    }
  });
};

const currentWeather = (
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(
        `Weatherstack API is not available: ${error.message}`,
        undefined,
      );
    } else if (response.body.error) {
      callback(
        `Weatherstack API error: ${response.body.error.type}`,
        undefined,
      );
    } else {
      callback(undefined, response);
    }
  });
};

countryCapital(process.argv[2], (coordErr, coordData) => {
  if (coordErr) {
    console.log(coordErr);
  } else if (coordData) {
    const name = coordData.body.name.common;
    const capital = coordData.body.capital[0];
    const longitude: number = coordData.body.latlng[0];
    const latitude: number = coordData.body.latlng[1];

    console.log()

    currentWeather(latitude, longitude, process.argv[3], process.argv[4], (weatherErr, weatherData) => {
      if (weatherErr) {
        console.log(weatherErr);
      } else if (weatherData) {
          console.table(weatherData.body.daily);
      }
    });
  }
});
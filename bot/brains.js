const request = require('request');
const dadJokesEndpoint = 'https://icanhazdadjoke.com/slack';
const weatherEndPoint = 'https://api.darksky.net/forecast/';

exports.getRandomJoke = (callback, user) => {
  return request(dadJokesEndpoint, (error, response) => {
    if (error) {
      console.log('Error: ', error);
    } else {
      let jokeJSON = JSON.parse(response.body);
      let joke = jokeJSON.attachments[0].text;
      return callback(joke, user);
    }
  });
};

exports.getWeather = (callback, user) => {
  const weatherApi = `${weatherEndPoint}${process.env.DARK_SKY}/42.3601,-71.0589`;
  return request(weatherApi, (error, response) => {
    if (error) {
      console.log('Error: ', error);
    } else {
      const weatherJSON = JSON.parse(response.body);
      const weatherSummary = weatherJSON.currently.summary;
      const wetherDailySummary = weatherJSON.daily.summary;
      let weatherLocation = weatherJSON.timezone.split('/')[1];
      weatherLocation = weatherLocation.split('_').join(' ');
      const weather = `The current weather in ${weatherLocation} is ${weatherSummary}. This week will be ${wetherDailySummary} Weather provided by provided by https://darksy.net`;

      return callback(weather, user);
    }
  });
};

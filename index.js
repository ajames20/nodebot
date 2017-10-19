require('dotenv').config({ path: '.env' });
const SlackBot = require('slackbots');
const request = require('request');
const dadJokesEndpoint = 'https://icanhazdadjoke.com/slack';
const weatherEndPoint = 'https://api.darksky.net/forecast/';

// create a bot
const bot = new SlackBot({
  token: process.env.TOKEN,
  name: 'Nodebot'
});

bot.on('start', function() {
  bot.postMessageToChannel(
    'general',
    'I am Crappy Dad Joke Bot you can message me with the command Joke to get a crappy dad joke, and use the command Weather to uselessly get the weather for New York, well unless you are in New York then it may be useful.'
  );
});

bot.on('message', msg => {
  console.log(msg.text);
  switch (msg.text.toLowerCase()) {
    case 'joke':
      // we only want to listen to direct messages that come from the user
      getRandomJoke(postMessage, msg.user);
      break;
    case 'weather':
      getWeather(postMessage, msg.user);
      break;
    default:
      'I only understand the joke and weather commands.';
      break;
  }
});

const postMessage = (message, user) => {
  bot.postMessageToChannel('general', message, { as_user: true });
};

const getRandomJoke = (callback, user) => {
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

const getWeather = (callback, user) => {
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

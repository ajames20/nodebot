require('dotenv').config({ path: '.env' });
const SlackBot = require('slackbots');
const brains = require('./bot/brains');

// create a bot
const bot = new SlackBot({
  token: process.env.TOKEN,
  name: 'Dad Joke Bot'
});

const postMessage = (message, user) => {
  bot.postMessageToChannel('general', message, { as_user: true });
};

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
      brains.getRandomJoke(postMessage, msg.user);
      break;
    case 'weather':
      brains.getWeather(postMessage, msg.user);
      break;
    default:
      break;
  }
});

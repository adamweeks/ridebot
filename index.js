require(`dotenv`).config();

const Botkit = require(`botkit`);
const getStatus = require(`./commands/get-status`);
const cancelRide = require(`./commands/cancel-ride`);
const displayHelp = require(`./commands/display-help`);
const getEta = require(`./commands/get-eta`);
const getCost = require(`./commands/get-cost`);
const sendMap = require(`./commands/send-map`);

// Sparkbot settings
var controller = Botkit.sparkbot({
  debug: true,
  log: true,
  public_address: process.env.public_address,
  ciscospark_access_token: process.env.CISCOSPARK_ACCESS_TOKEN,
  secret: process.env.secret,
  json_file_store: `./storage`
});

// Sparkbot instance
var bot = controller.spawn({
});

global.bot = bot;
global.controller = controller;

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
  controller.createWebhookEndpoints(webserver, bot, function() {
    console.log("SPARK: Webhooks set up!");
  });
});

controller.on('direct_mention,direct_message', function(bot, message) {
  parseMessage(message);
});

function parseMessage(message) {
  // Switch here on the first word of command
  var splitString = message.text.split(` `);
  var command = splitString[0].toLowerCase();
  splitString.shift();
  var initialArguments = splitString.join(` `);

  switch(command.toLowerCase()) {
    case 'eta':
      getEta(message, initialArguments);
      break;
    case 'status':
      getStatus(message);
      break;
    case 'map':
      sendMap(message, initialArguments);
      break;
    case 'cancel':
      cancelRide();
      break;
    case 'request':
    case 'cost':
      getCost(message, initialArguments);
      break;
    case 'halp':
      halp(message);
      break;
    default:
      displayHelp(message);
      break;
  }
}

function halp(message) {
  var halpert = `http://images5.fanpop.com/image/photos/27800000/8x01-The-List-jim-halpert-27875750-1279-714.jpg`;
  bot.reply(message, {files:[halpert]});
}

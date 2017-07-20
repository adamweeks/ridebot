require('dotenv').config();

var Botkit = require('botkit');
var moment = require('moment');

var parseAddress = require('./utils/parse-address');
var getStatus = require('./commands/get-status');
var requestRide = require('./commands/request-ride');
var cancelRide = require('./commands/cancel-ride');
var displayHelp = require('./commands/display-help');
var getEta = require('./commands/get-eta');

// Sparkbot settings
var controller = Botkit.sparkbot({
  debug: true,
  log: true,
  public_address: process.env.public_address,
  ciscospark_access_token: process.env.CISCOSPARK_ACCESS_TOKEN,
  secret: process.env.secret,
  json_file_store: './storage'
});

// Sparkbot instance
var bot = controller.spawn({
});


controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
  controller.createWebhookEndpoints(webserver, bot, function() {
    console.log("SPARK: Webhooks set up!");
  });
});

controller.hears('hello', 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, 'Hi');
});

controller.on('direct_mention', function(bot, message) {
  parseMessage(bot, message);
});

controller.on('direct_message', function(bot, message) {
    parseMessage(bot, message);
});

function parseMessage(bot, message) {
  // Switch here on the first word of command
  var splitString = message.text.split(` `);
  var command = splitString[0];
  splitString.shift();
  var arguments = splitString.join(` `);
  switch(command.toLowerCase()) {
    case 'eta':
      return getEta(bot, message, arguments);
      break;
    case 'status':
        getStatus();
        break;
    case 'request':
        requestRide();
        break;
    case 'cancel':
        cancelRide();
        break;
    case 'cost':
        break;
    case 'halp':
        break;
    default:
        displayHelp(bot, message);
        break;
  }
}

function halp(bot, message) {
  var halpert = `http://images5.fanpop.com/image/photos/27800000/8x01-The-List-jim-halpert-27875750-1279-714.jpg`;
  bot.reply(message, {files:[halpert]});
}

var Botkit = require('botkit');
require('dotenv').config();
var lyft = require('node-lyft');
var moment = require('moment');

var getStatus = require('./commands/get-status');
var requestRide = require('./commands/request-ride');
var cancelRide = require('./commands/cancel-ride');
var displayHelp = require('./commands/display-help');
var getEta = require('./commands/get-eta');

var defaultClient = lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = process.env.LYFT_TOKEN;
//create a new lyft-node PublicApi() instance
var lyftPublicApi = new lyft.PublicApi()


var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.CISCOSPARK_ACCESS_TOKEN,
    secret: process.env.secret
});


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
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});

function parseMessage(bot, message) {
  // Switch here on the first word of command
  getEta(lyftPublicApi, {latitude: 37.7884, longitude: -122.4076}).then((data) => {
    bot.reply(message, `A driver is ${moment().add(data.eta_seconds, `s`).toNow(true)} away`);
  })
  .catch((error) => {
    console.error(error);
  });

  halp(bot, message);
}

function halp(bot, message) {
  var halpert = `http://images5.fanpop.com/image/photos/27800000/8x01-The-List-jim-halpert-27875750-1279-714.jpg`;
  bot.reply(message, {files:[halpert]});
}

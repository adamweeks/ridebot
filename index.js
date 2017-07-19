require('dotenv').config();

var Botkit = require('botkit');
var lyft = require('node-lyft');
var moment = require('moment');
var NodeGeocoder = require('node-geocoder');

var getStatus = require('./commands/get-status');
var requestRide = require('./commands/request-ride');
var cancelRide = require('./commands/cancel-ride');
var displayHelp = require('./commands/display-help');
var getEta = require('./commands/get-eta');


var defaultClient = lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = process.env.LYFT_TOKEN;
//create a new lyft-node PublicApi() instance
var lyftPublicApi = new lyft.PublicApi()

// Sparkbot settings
var controller = Botkit.sparkbot({
  debug: true,
  log: true,
  public_address: process.env.public_address,
  ciscospark_access_token: process.env.CISCOSPARK_ACCESS_TOKEN,
  secret: process.env.secret
});

// Sparkbot instance
var bot = controller.spawn({
});


// Google settings
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GMAP_KEY,
  formatter: null         // 'gpx', 'string', ...
};

// Google instance
var geocoder = NodeGeocoder(options);

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
  var command = message.text.split(" ")[0];
  switch(command.toLowerCase()) {
        case 'eta':
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
            displayHelp();
            break;
  }
  // getEta(lyftPublicApi, {latitude: 37.7884, longitude: -122.4076}).then((data) => {
  //   bot.reply(message, `A driver is ${moment().add(data.eta_seconds, `s`).toNow(true)} away`);
  // })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // halp(bot, message);
}

function halp(bot, message) {
  var halpert = `http://images5.fanpop.com/image/photos/27800000/8x01-The-List-jim-halpert-27875750-1279-714.jpg`;
  bot.reply(message, {files:[halpert]});
}

/**
 *
 * @param {String} address
 */
function parseAddress(address) {
  return geocoder.geocode(address)
    .then((data) => {
      if (data.length) {

        const lat = data[0].latitude;
        const lgn = data[0].longitude;

        return {
          latitude: lat,
          longitude: lgn
        };

      } else {
        throw new Error(`Sorry, couldn't find the latitude and longitude for the address provided`);
      }
    });
}

// IMPLEMENTATION
// parseAddress(message.text)
// .then((data) => {
//    getETA(data.latitude, data.longitude)
//     .then((data) => {
//       bot.reply(message, `eta received: ${JSON.stringify(data)}`);
//     })
//     .catch((error) => {
//       bot.reply(message, `Error: ${JSON.stringify(error)}`);
//     });
// })
// .catch((error) => {
//   bot.reply(message, `Error: ${error}`);
// });

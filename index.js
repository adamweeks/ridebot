var Botkit = require('botkit');
require('dotenv').config();
var lyft = require('node-lyft');
var getStatus = require('./commands/get-status');
var requestRide = require('./commands/request-ride');
var cancelRide = require('./commands/cancel-ride');
var displayHelp = require('./commands/display-help');
var NodeGeocoder = require('node-geocoder');
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
  apiKey: 'AIzaSyAKfUiqHAvyYcKflBP9-iL6msWpaTY5o84', // for Mapquest, OpenCage, Google Premier 
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
  parseAddress(message.text)
    .then((data) => {

      if (data.length) {
        
        const lat = data[0].latitude;
        const lgn = data[0].longitude;

        getETA(lat, lgn).then((data) => {
          bot.reply(message, `eta received: ${JSON.stringify(data)}`);
        })
        .catch((error) => {
          console.error(error);
        });

      } else {
        bot.reply(message, `Sorry, couldn't find the latitude and longitude for the address provided`);
      }

    })
    .catch((error) => {
      console.error('error -->', error);
    });
});

controller.on('direct_message', function(bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});


function parseMessage(message) {
  // Switch here on the first word of command
  getETA();
}

/**
 * 
 * @param {String} address.text
 */
function parseAddress(address) {
  return geocoder.geocode(address);
}

function getETA() {
  //the getETA endpoint works with both user and non-user context:
  //leaving the options field empty {}
  //and using promises/then to print out result
  return lyftPublicApi.getETA(37.7884, -122.4076, {}).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
    return data;
  });
}

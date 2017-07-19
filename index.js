var Botkit = require('botkit');
require('dotenv').config();
var lyft = require('node-lyft');
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
    // bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
    getETA().then((data) => {
      bot.reply(message, `eta received: ${JSON.stringify(data)}`);
    })
    .catch((error) => {
      console.error(error);
    })
});

controller.on('direct_message', function(bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});

function getETA() {
  //the getETA endpoint works with both user and non-user context:
  //leaving the options field empty {}
  //and using promises/then to print out result
  return lyftPublicApi.getETA(37.7884, -122.4076, {}).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
    return data;
  });
}
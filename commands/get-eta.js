var moment = require('moment');
var parseAddress = require('../utils/parse-address');


function getEta(bot, message, initialArguments, lyftPublicApi) {
  if (initialArguments) {
    return parseAndFetch(initialArguments, lyftPublicApi, bot, message);
  }

  // Start the conversation for getting an eta
  bot.startConversation(message, (err, convo) => {
    convo.ask(`What is your current location?`, (response, convo) => {
      parseAndFetch(response.text, lyftPublicApi, bot, message).then(() => convo.next());
    });
  });
}


function parseAndFetch(address, lyftPublicApi, bot, message) {
  return parseAddress(address)
    .then((location) => {
      return getEtaFromLyft(lyftPublicApi, location)
        .then((data) => {
          bot.reply(message, `A driver is ${moment().add(data.eta_seconds, `s`).toNow(true)} away from ${location.formattedAddress}`);
        })
        .catch((error) => {
          bot.reply(message, `Sorry, we had problems contacting lyft: ${error.message}`);
        });
      })
    .catch((error) => {
      bot.reply(message, `Sorry, we couldn't determine the location (${initialArguments}): ${error.message}`);
    });
}

/**
 * @param {Object} lyftPublicApi
 * @param {Object} location
 * @param {Number} location.latitude
 * @param {Number} location.longitude
 */
function getEtaFromLyft(lyftPublicApi, location) {
  return lyftPublicApi.getETA(location.latitude, location.longitude, {}).then((data) => {
    return data.eta_estimates.find((estimate) => {
      return estimate.ride_type === `lyft`;
    });
  });
}

/*
{
  “eta_estimates”:[
    {
        “ride_type”:“lyft_line”,
        “display_name”:“Lyft Line”,
        “eta_seconds”:240,
        “is_valid_estimate”:true
    },
    {
        “ride_type”:“lyft”,
        “display_name”:“Lyft”,
        “eta_seconds”:240,
        “is_valid_estimate”:true
    },
    {
        “ride_type”:“lyft_plus”,
        “display_name”:“Lyft Plus”,
        “eta_seconds”:300,
        “is_valid_estimate”:true
    },
    {
        “ride_type”:“lyft_premier”,
        “display_name”:“Lyft Premier”,
        “eta_seconds”:120,
        “is_valid_estimate”:true
    },
    {
        “ride_type”:“lyft_lux”,
        “display_name”:“Lyft Lux”,
        “eta_seconds”:120,
        “is_valid_estimate”:true
    },
    {
        “ride_type”:“lyft_luxsuv”,
        “display_name”:“Lyft Lux SUV”,
        “eta_seconds”:120,
        “is_valid_estimate”:true
    }
  ]
}
*/

module.exports = getEta;
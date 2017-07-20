const moment = require(`moment`);
const parseAddress = require(`../utils/parse-address`);
const getLyftApi = require(`../utils/lyft-api`);

function getEta(bot, message, initialArguments) {
  if (initialArguments) {
    return parseAndFetch(initialArguments, bot, message);
  }

  // Start the conversation for getting an eta
  return bot.startConversation(message, (err, convo) => {
    convo.ask(`What is your current location?`, (response, responseconvo) => {
      parseAndFetch(response.text, bot, message).then(() => responseconvo.next());
    });
  });
}


function parseAndFetch(address, bot, message) {
  return parseAddress(address)
    .then((location) => {
      return getEtaFromLyft(location)
        .then((data) => {
          bot.reply(message, `A driver is ${moment().add(data.eta_seconds, `s`).toNow(true)} away from ${location.formattedAddress}`);
        })
        .catch((error) => {
          bot.reply(message, `Sorry, we had problems contacting lyft: ${error.message}`);
        });
    })
    .catch((error) => {
      bot.reply(message, `Sorry, we couldn't determine the location (${address}): ${error.message}`);
    });
}

/**
 * @param {Object} location
 * @param {Number} location.latitude
 * @param {Number} location.longitude
 */
function getEtaFromLyft(location) {
  return getLyftApi()
    .getETA(location.latitude, location.longitude, {})
    .then(data => data.eta_estimates.find(estimate => estimate.ride_type === `lyft`));
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

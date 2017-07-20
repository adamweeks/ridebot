const rp = require('request-promise');

/**
 *
 * @param {Object} bot
 * @param {Object} message
 * @param {Object} from
 * @param {Number} from.lat
 * @param {Number} from.lng
 * @param {Object} to
 * @param {Number} to.lat
 * @param {Number} to.lng
 */
function requestRide(message, from, to) {
  var options = {
    method: 'POST',
    uri: 'https://api.lyft.com/v1/rides',
    headers: {
        'Authorization': 'Bearer ' + process.env.LYFT_TOKEN,
        'User-Agent': 'Request-Promise',
        'Content-Type': 'application/json'
    },
    body: {
      ride_type: "lyft",
      origin: from,
      destination: to
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp(options)
    .then(function (data) {
      try {
        bot.reply(message, {
          text: `Hey ${data.passenger.first_name}, your ride request has been submitted with a status of ${data.status}`,
          markdown: `Hey **${data.passenger.first_name}**, your ride request has been submitted with a status of **${data.status.toUpperCase()}**`
        });
      } catch(err) {
        bot.reply(message, `Something went wrong: ${JSON.stringify(err)}`);
      }

    })
    .catch(function (err) {
      bot.reply(message, `Something went wrong: ${JSON.stringify(err)}`);
    });

}

module.exports = requestRide;

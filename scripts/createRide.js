require(`dotenv`).config();
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
function requestRide(from, to) {
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
      console.info(`Ride (${data.ride_id})`);
      console.info({data});
    })
    .catch(function (err) {
      console.error(err);
    });
}

const from = {
  "lat": 28.5365293,
  "lng": -81.3790681
};

const to = {
  "lat": 28.5390409,
  "lng": -81.4027449
};

requestRide(from, to);

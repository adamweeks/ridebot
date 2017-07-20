const rp = require('request-promise');
const { getUserRide } = require('../utils/rides');
// Gets status of ride in progress or displays error if none

function getStatus(message) {
  getUserRide(message.user)
    .then(rideId => {
      if(!rideId){
        bot.reply(message, 'You have no rides')
      }else{
        var options = {
          method: 'GET',
          uri: `https://api.lyft.com/v1/rides/${rideId}`,
          headers: {
              'Authorization': 'Bearer ' + process.env.LYFT_TOKEN,
              'User-Agent': 'Request-Promise',
              'Content-Type': 'application/json'
          },
          json: true // Automatically parses the JSON string in the response
        };

        return rp(options)
          .then(function (data) {
            console.log(data);
            try {
              bot.reply(message, {
                text: `Hey ${data.passenger.first_name}, your ride status is ${data.status}`,
                markdown: `Hey **${data.passenger.first_name}**, your ride status is **${data.status.toUpperCase()}**`
              });
            } catch(err) {
              bot.reply(message, `Something went wrong: ${JSON.stringify(err)}`);
            }
          })
          .catch(function (err) {
            bot.reply(message, `Something went wrong: ${JSON.stringify(err)}`);
          });

      }
    })
}
module.exports = getStatus;
/*
{
  "status": "pending",
  "ride_id": "123",
  "ride_type": "lyft",
  "passenger": {
    "rating": "5",
    "first_name": "John",
    "last_name": "Smith",
    "image_url": "https://lyft.com/max1200.jpg",
    "user_id": "123"
  },
  "destination": {
    "lat": 37.771,
    "lng": -122.39123,
    "eta_seconds": null,
    "address": "Mission Bay Boulevard North"
  },
  "origin": {
    "lat": 37.77663,
    "lng": -122.39227,
    "address": null
  }
}
*/

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

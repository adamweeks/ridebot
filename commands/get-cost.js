var parseAddress = require('../utils/parse-address');
var {getLyftPublicApi} = require('../utils/lyft-api');
const requestRide = require(`./request-ride`);
var sendMap = require(`./send-map`);

var {getMapUrl} = require(`../utils/get-map`);
var parseAddress = require('../utils/parse-address');


function getCost(message) {
  bot.createConversation(message, function(err, convo) {
    let cost, start, end;
    convo.addQuestion('Where would you like to be picked up?',function(response,convo) {
      console.info(response);
      return parseAddress(response.text)
        .then((location) => {
          console.log(location);
          if (location) {
            start = location;
            const mapUrl = getMapUrl(location.longitude, location.latitude);
            convo.transitionTo('drop_off', {
              text: location.formattedAddress, files:[mapUrl]
            });
          }
          else {
            convo.say(`We can't understand your start address, please try again.`);
            convo.repeat();
          }
        });
    },{},'default');

    convo.addQuestion('Where would you like to be dropped off?',function(response,convo) {
      console.info(response);
      return parseAddress(response.text)
        .then((location) => {
          console.log(location);
          if (location) {
            end = location;
            const mapUrl = getMapUrl(location.longitude, location.latitude);
            convo.transitionTo('cost', {
              text: location.formattedAddress, files:[mapUrl]
            });

          }
          else {
            convo.say(`We can't seem to find your drop off address, please try again.`);
            convo.repeat();
          }
        });
    },{},'drop_off');

    convo.beforeThread(`cost`, (convo, next) => {
      return getCostFromLyft(start, end)
        .then((costObj) => {
          console.log(costObj);
          cost = costObj.cost_estimates[0];

          if (cost.is_valid_estimate) {
            convo.setVar(`start`, start);
            convo.setVar(`end`, end);
            convo.setVar(`cost`, {min: formatCost(cost.estimated_cost_cents_min), max: formatCost(cost.estimated_cost_cents_max)});
            next();
          }
          else {
          convo.transitionTo(`default`, `Your ride from \
            \n${start.formattedAddress}\
            \n to ${end.formattedAddress}\
            \n doesn't make sense... why don't we try that again...`);
          }
        })
        .catch((error) => {
          convo.transitionTo(`default`, `There was an error estimating your ride from \
            \n${start.formattedAddress}\
            \n to ${end.formattedAddress}\
            \n why don't we try that again...`);
          throw new Error(error);
        });
      }
    );
    
    convo.addMessage({ text: 'Your ride from \
      \n{{vars.start.formattedAddress}}\
      \n to {{vars.end.formattedAddress}}\
      \n will cost ${{vars.cost.min}} - ${{vars.cost.max}}', action: `confirm`}, 'cost');

    convo.addQuestion('Would you like to request this ride?', [
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say('Great! I will request your ride.');
          requestRide(message, { lat: start.latitude, lng: start.longitude }, { lat: end.latitude, lng: end.longitude });
          convo.next();
        }
      },
      {
        pattern: bot.utterances.no,
        callback: function(response,convo) {
          convo.say('Perhaps later.');
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          convo.repeat();
          convo.next();
        }
      }
    ],{},'confirm');

    convo.activate();
  });
}

function getCostFromLyft(start, end) {
  return getLyftPublicApi().getCost(start.latitude, start.longitude, {endLat: end.latitude, endLng: end.longitude, rideType: `lyft`}).then((data) => {
    return data;
  }, (error) => {
    console.error(error);
  });
}

function formatCost(cost) {
  let fcost = cost / 100;
  if (Math.floor(fcost) === fcost) {
    return Math.floor(fcost);
  }
  return fcost.toFixed(2);
}


module.exports = getCost;

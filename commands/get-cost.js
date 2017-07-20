var parseAddress = require('../utils/parse-address');
var getLyftApi = require('../utils/lyft-api');

function getCost(message, lyftApi) {
  bot.createConversation(message, function(err, convo) {
    let cost, start, end;
    convo.addQuestion('Where would you like to be picked up?',function(response,convo) {
      console.info(response);
      return parseAddress(response.text)
        .then((location) => {
          console.log(location);
          if (location) {
            start = location;
            convo.gotoThread('drop_off');
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
            getCostFromLyft(lyftApi, start, end)
              .then((costObj) => {
                console.log(costObj);
                cost = costObj.cost_estimates[0];
                if (cost.is_valid_estimate) {
                  convo.say(`Your ride from \
                  \n${start.formattedAddress}\
                  \n to ${end.formattedAddress}\
                  \n will cost $${formatCost(cost.estimated_cost_cents_min)} - $${formatCost(cost.estimated_cost_cents_max)}`);
                  convo.next();
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
          else {
            convo.say(`We can't seem to find your drop off address, please try again.`);
            convo.repeat();
          }
        });
    },{},'drop_off');
    convo.activate();
  });
}

function getCostFromLyft(lyftApi, start, end) {
  return getLyftApi().getCost(start.latitude, start.longitude, {endLat: end.latitude, endLng: end.longitude, rideType: `lyft`}).then((data) => {
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

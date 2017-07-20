var {getMapUrl} = require(`../utils/get-map`);
var parseAddress = require('../utils/parse-address');

module.exports = function sendMap(message, location) {
  return parseAddress(location)
    .then((loc) => {
      const mapUrl = getMapUrl(loc.longitude, loc.latitude);
      console.log(mapUrl);
      bot.reply(message, {text: loc.formattedAddress, files:[mapUrl]});
    });
};

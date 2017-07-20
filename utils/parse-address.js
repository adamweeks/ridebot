var NodeGeocoder = require('node-geocoder');
/**
 *
 * @param {String} address
 */

// Google settings
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GMAP_KEY,
  formatter: null         // 'gpx', 'string', ...
};

// Google instance
var geocoder = NodeGeocoder(options);

/**
 *
 * @param {String} address
 * @returns {Promise}
 */
function parseAddress(address) {
  if (!address) {
    return Promise.reject(new Error(`An address is required to use this.`));
  }
  return geocoder.geocode(address)
    .then((data) => {
      if (data.length) {

        const lat = data[0].latitude;
        const lgn = data[0].longitude;

        return {
          formattedAddress: data[0].formattedAddress,
          latitude: lat,
          longitude: lgn
        };

      } else {
        throw new Error(`Sorry, couldn't find the latitude and longitude for the address provided`);
      }
    });
}


module.exports = parseAddress;

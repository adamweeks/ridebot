var lyft = require('node-lyft');

var defaultClient = lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = process.env.LYFT_TOKEN;
//create a new lyft-node PublicApi() instance
var lyftPublicApi = null;

function getLyftApi() {
  return !lyftPublicApi ? new lyft.PublicApi() : lyftPublicApi;
}

module.exports = getLyftApi;
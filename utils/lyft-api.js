let lyft = require('node-lyft');

let defaultClient = lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = process.env.LYFT_TOKEN;

let defaultUser = lyft.ApiClient.instance;
defaultUser.authentications['User Authentication'].accessToken = process.env.LYFT_TOKEN;

// create a new lyft-node PublicApi() instance
let lyftPublicApi = null;
let lyftUserApi = null;
let lyftSandBoxApi = null;

function getLyftPublicApi() {
  return !lyftPublicApi ? new lyft.PublicApi() : lyftPublicApi;
}

function getLyftUserApi() {
  return !lyftUserApi ? new lyft.UserApi() : lyftUserApi;
}

function getLyftSandboxApi() {
  return !lyftSandBoxApi ? new lyft.SandboxApi() : lyftSandBoxApi;
}

module.exports = {
  getLyftPublicApi,
  getLyftSandboxApi,
  getLyftUserApi,
};

require(`dotenv`).config();
const rp = require('request-promise');
const argv = require('yargs').argv;
const lyft = require('node-lyft');
var { getLyftSandboxApi } = require('../utils/lyft-api');

if (!argv.rideId || !argv.status) {
  return console.error(`rideId and status are required`);
}


let id = argv.rideId; // String | The ID of the ride

var options = {
  method: 'PUT',
  uri: `https://api.lyft.com/v1/sandbox/rides/${id}`,
  headers: {
      'Authorization': 'Bearer ' + process.env.LYFT_TOKEN,
      'User-Agent': 'Request-Promise',
      'Content-Type': 'application/json'
  },
  body: {
    status: argv.status
  },
  json: true // Automatically parses the JSON string in the response
};

return rp(options)
  .then((data) => {
    console.log('API called successfully. Returned data: ' + data);
  }, (error) => {
    console.error(error);
  });

// let request = new lyft.SandboxRideStatus(argv.status); // SandboxRideStatus | status to propagate the ride into
// console.info({request});
// var sandboxApi = getLyftSandboxApi();
// sandboxApi.setRideStatus(id, request).then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// }, (error) => {
//   console.error(error);
// });

// var options = {
//   method: 'POST',
//   uri: 'https://api.lyft.com/v1/rides',
//   headers: {
//       'Authorization': 'Bearer ' + process.env.LYFT_TOKEN,
//       'User-Agent': 'Request-Promise',
//       'Content-Type': 'application/json'
//   },
//   body: {
//     ride_type: "lyft",
//     origin: from,
//     destination: to
//   },
//   json: true // Automatically parses the JSON string in the response
// };

// return rp(options)
//   .then(function (data) {


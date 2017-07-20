const RIDE_ID = `RIDE_ID`;

/**
 * gets the current ride for a user
 * @param {string} user
 */
function getUserRide(user) {
  return new Promise((resolve) => {
    controller.storage.users.get(user, (err, userData) => {
      console.info({ userData });
      if (userData && userData[RIDE_ID]) {
        resolve(userData[RIDE_ID]);
      }
      else {
        resolve(false);
      }
    });
  });
}

function setUserRide(user, ride) {
  const rideObject = {};
  rideObject[RIDE_ID] = ride;
  const userObject = {};
  userObject[user] = rideObject;
  controller.storage.users.save(userObject);
}

module.exports = { getUserRide, setUserRide };

/**
 * gets the current ride for a user
 * @param {string} user
 */
function getUserRide(user) {
  return new Promise((resolve) => {
    // controller.storage.users.all((err, userData) => {
    controller.storage.users.get(user, (err, userData) => {
      console.info({ userData });
      if (userData && userData.rideId) {
        resolve(userData.rideId);
      }
      else {
        resolve(false);
      }
    });
  });
}

function setUserRide(user, ride) {
  controller.storage.users.save({
    id: user,
    rideId: ride
  });
}

module.exports = { getUserRide, setUserRide };

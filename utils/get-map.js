const request = require('request').defaults({ encoding: null });

function getMapObject(lng, lat) {
  const mapUrl = getMapUrl(lng, lat);
  request.get(mapUrl, (err, res, body) => {
    console.log(body);
  });
}

function getMapUrl(lng, lat) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=&zoom=17&size=600x600&maptype=roadmap&markers=color:blue%7C${lat},${lng}&key=${process.env.GMAP_KEY}`;
}

module.exports = {
  getMapObject,
  getMapUrl
};

// add to controller
function onGetUserPos() {
  locService.getPosition().then((pos) => {
    var location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    changeWindow(location);
  });
}

// add to loc.service
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// on copy location btn + add to controller
function onCopyLocation() {
  locService.getPosition().then((pos) => {
    var locationUrl =
      window.location.href +
      `?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;
    console.log(locationUrl);
  });
}

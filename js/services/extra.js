// add to controller
function onGetUserPos() {
  locService.getPosition().then((pos) => {
    var location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    changeWindow(location);
  });
}

// on copy location btn + add to controller

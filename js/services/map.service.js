<<<<<<< HEAD
import { storageService } from './storage.service.js';
import { locService } from './loc.service.js';

export const mapService = {
  initMap,
  addMarker,
  panTo,
=======

export const mapService = {
    initMap,
    addMarker,
    panTo,
    addEventListener,
>>>>>>> 8e6e18927a4b5db20472bbfb76439cbd60c44f85
};

// Var that is used throughout this Module (not global)
var gMap;
var gInfoWindow

function initMap(lat = 32.0749831, lng = 34.9120554) {
<<<<<<< HEAD
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
  });
=======
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15,
            })
            addEventListener()
            console.log('Map!', gMap);
        })
>>>>>>> 8e6e18927a4b5db20472bbfb76439cbd60c44f85
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();

  const API_KEY = 'AIzaSyB5ZJRjf-HF2mtuA1LUnWH_xxDwfZBQpxo';

  var elGoogleApi = document.createElement('script');

  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

function addEventListener() {
<<<<<<< HEAD
  console.log('click');
  gMap.addListener('click', (mapsMouseEvent) => {
    // console.log(mapsMouseEvent)
    console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
  });
=======
    console.log('click');
    gMap.addListener('click', (mapsMouseEvent) => {

        // const infoContent = getInfoContent()
        // console.log(mapsMouseEvent)
        if (gInfoWindow) {

            gInfoWindow.close();
        }
        gInfoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        gInfoWindow.setContent(
            getInfoContent()
            // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        gInfoWindow.open(gMap);
    });
>>>>>>> 8e6e18927a4b5db20472bbfb76439cbd60c44f85
}

function getInfoContent() {
    return `
    <div>
    <h2>sfasfafsa</h2>
    <p>fsfass</p>
</div>
    
    
    
    `
}



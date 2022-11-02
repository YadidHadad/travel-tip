export const mapService = {
    initMap,
    addMarker,
    panTo,
    addEventListener,
    codeAddress,
    getCurrLoc,
    closeInfoWindow,
}

// Var that is used throughout this Module (not global)
var gMap
var gGeocoder
var gInfoWindow
var gCurrLoc

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gGeocoder = new google.maps.Geocoder()
            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15,
            })
            addEventListener()
            console.log('Map!', gMap);
        })
}

function addMarker(pos) {
    var marker = new google.maps.Marker({
        position: pos,
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
    console.log('click');
    gMap.addListener('click', onClickMap);
}

function onClickMap(mapsMouseEvent) {
    const { lat, lng } = mapsMouseEvent.latLng.toJSON()
    reverseCodeAddress(lat, lng)
        .then(results => {
            console.log(`results:`, results)
            if (gInfoWindow) {
                gInfoWindow.close()
            }
            gInfoWindow = new google.maps.InfoWindow({
                position: mapsMouseEvent.latLng,

            })
            gInfoWindow.setContent(
                setInfoContent(results.results[0].formatted_address)
            )
            gInfoWindow.open(gMap)

            gCurrLoc = { coords: { lat, lng }, address: results.results[0].formatted_address }
            console.log(gCurrLoc)


        })
}

function closeInfoWindow() {
    gInfoWindow.close()
}
function setInfoContent(address = 'address') {
    return `
        <div div class= "info-window" >
            <h2>Your next stop is:</h2>
            <p>${address}</p>
            <input type="text" class="loc-name" placeholder="Name this place!"/>
            <button onclick="onSaveLoc(event)">save</button>
        </div >
        `
}

function codeAddress() {
    var address = document.getElementById('address').value;
    gGeocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            gMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: gMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function reverseCodeAddress(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng)
    // This is making the Geocode request
    console.log(`latlng:`, latlng)

    const address = gGeocoder.geocode({ 'latLng': latlng }, (results, status) => {
        var address

        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            address = (results[0].formatted_address)
        }
        return address
    })

    return address
}

function getCurrLoc() {
    return gCurrLoc
}
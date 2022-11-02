import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.getPosition = getPosition

var gUserCurrPos

// let gInfoWindow
function onInit() {
    onGetUserPos()
        .then(() => {
            mapService.initMap(locService.loadCurrPos().lat, locService.loadCurrPos().lng)
                .then(() => { onAddMarker(locService.loadCurrPos()) })
            // .then(() => locService.addEventListener())
        })
        .catch(() => console.error('Error: cannot init map'))

    // renderLocationTable()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker(pos) {
    console.log('Adding a marker');
    mapService.addMarker(pos);
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log('Locations:', locs);
        document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2);
    });
}

function onGetUserPos() {
    return new Promise((resolve, reject) => {
        resolve(getPosition()
            .then((pos) => { return { lat: pos.coords.latitude, lng: pos.coords.longitude } })
            .then(userPos => { locService.saveCurrLoc(userPos); return userPos })
        )
    })
}

function onPanTo(pos) {
    console.log(`pos:`, pos)
    console.log('Panning the Map');
    // mapService.panTo(35.6895, 139.6917);
    mapService.panTo(pos.lat, pos.lng);
}

function renderLocationTable() {
    locService.getLocs()
        .then(locs => {
            const strHtmls = locs.forEach(({ name }) => {
                return `<div class="location-item">
                            <h2 class="loc-name">${name}</h2>
                        </div>
                        `
            })
            document.querySelector('.location-table').innerHTML = strHtmls
        }
        )
}

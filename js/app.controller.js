import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
// import { weatherService } from './services/weather.service.js';

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.getPosition = getPosition
window.onCodeAddress = onCodeAddress
window.onSaveLoc = onSaveLoc
window.onMyLoc = onMyLoc
window.onCopyLoc = onCopyLoc
window.getQueryParams = getQueryParams

var gUserCurrPos;

// let gInfoWindow
function onInit() {
    onGetUserPos()
        .then(() => {
            mapService.initMap(locService.loadCurrPos().lat, locService.loadCurrPos().lng)
                .then(() => { onAddMarker(locService.loadCurrPos()) })
                .catch(() => console.error('Error: cannot init map'))
        })
        .catch(() => console.error('Error: cannot get user position'))

    renderLocationTable()
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
        resolve(
            getPosition()
                .then((pos) => {
                    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
                })
                .then((userPos) => {
                    locService.saveCurrLoc(userPos);
                    return userPos;
                })
        );
    });
}

function onPanTo(pos) {
    console.log(`pos:`, pos);
    console.log('Panning the Map');
    // mapService.panTo(35.6895, 139.6917);
    mapService.panTo(pos.lat, pos.lng);
}

function renderLocationTable() {
    locService.getLocs()
        .then(locs => {
            console.log(`locs:`, locs)
            const strHTMLs = locs.map(({ name, createdAt }) => {
                return `<div class="location-value flex row align-center justify-center">
                            <h2 class="loc-name">${name}</h2>
                            <h5 class="loc-name">${createdAt}</h5>
                        </div>
                        `
            })

            console.log(`strHTMLs:`, strHTMLs)
            document.querySelector('.location-table').innerHTML = strHTMLs.join('')
        }
        )
}

function onCodeAddress(ev) {
    debugger
    ev.preventDefault()
    mapService.codeAddress()
}

function onSaveLoc(ev) {
    console.log('save loc')

    const locName = document.querySelector('.loc-name').value
    const { lat, lng } = mapService.getCurrLoc().coords
    const address = mapService.getCurrLoc().address

    const loc = locService.createLoc(locName, address, lat, lng,)
    console.log(`loc:`, loc)

    renderLocationTable()
    mapService.closeInfoWindow()
}

function onMyLoc() {
    const currPos = locService.loadCurrPos()

    mapService.panTo(currPos.lat, currPos.lng);
}

function onCopyLoc() {
    getPosition()
        .then((pos) => {
            var locationUrl =
                window.location.href +
                `?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
            console.log(locationUrl);
        })
}

function getQueryParams() {
    const url = new URL(window.location.href)
    const searchParams = url.searchParams

    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    return { lat, lng }
}


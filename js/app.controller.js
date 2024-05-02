import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { weatherService } from './services/weather.service.js';

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGoToLoc = onGoToLoc
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.getPosition = getPosition
window.onCodeAddress = onCodeAddress
window.onSaveLoc = onSaveLoc
window.onMyLoc = onMyLoc
window.onCopyLoc = onCopyLoc
window.getQueryParams = getQueryParams
window.onDeleteLoc = onDeleteLoc
window.renderChosenLocAddress = renderChosenLocAddress
window.addEventListener = addEventListener

var gUserCurrPos;
var gInfoWindow;
const API_KEY = '${secrets.MAPS_KEY}';

function onInit() {
    onGetUserPos()
        .then(() => {
            mapService
                .initMap(locService.loadCurrPos().lat, locService.loadCurrPos().lng)
                .then(map => { addEventListener(map) })
                .then(() => { onGetWaether(locService.loadCurrPos().lat, locService.loadCurrPos().lng) })
                .then(() => { onAddMarker(locService.loadCurrPos(), 'You are Here!', 'home') })
                .then(() => renderLocationTable())
                .then(() => renderMarkers())
                .catch(() => console.error('Error: cannot init map'))
        })
        .catch(() => console.error('Error: cannot get user position'))
}

function addEventListener(map) {
    map.addListener('click', onAddLoc);
}

function onAddLoc(mapsMouseEvent) {
    const { lat, lng } = mapsMouseEvent.latLng.toJSON()
    console.log(lat, lng)
    onGetWaether(lat, lng)

    mapService.reverseCodeAddress(lat, lng)
        .then(results => {
            if (gInfoWindow) {
                gInfoWindow.close()
            }
            gInfoWindow = new google.maps.InfoWindow({
                position: mapsMouseEvent.latLng,

            })
            gInfoWindow.setContent(
                setInfoContent(results.results[0].formatted_address)
            )
            gInfoWindow.open(mapService.getMap())

            mapService.saveCurrLoc({ coords: { lat, lng }, address: results.results[0].formatted_address })

            renderChosenLocAddress(mapService.getCurrLoc().address)
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
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker(pos, name, icon) {
    mapService.addMarker(pos, name, icon);
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
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
    mapService.panTo(pos.lat, pos.lng);
}

function onGoToLoc(lat, lng, name, address) {
    mapService.panTo(lat, lng);

    renderChosenLocAddress(address, name)
}

function renderMarkers() {
    console.log('render locs')
    locService.getLocs()
        .then(locs => {
            locs.forEach(({ name, createdAt, lat, lng, id, address }) => {
                const pos = { 'lat': lat, 'lng': lng }
                onAddMarker(pos, name)
            })
        }
        )
}

function renderLocationTable() {
    console.log('render locs')
    locService.getLocs()
        .then(locs => {
            const strHTMLs = locs.map(({ name, createdAt, lat, lng, id, address }) => {
                const pos = { 'lat': lat, 'lng': lng }
                return `
                <div class="location-value flex column align-center justify-between">
                    <div class="">
                    <div>
                    <h2 class="loc-name">${name}</h2>
                    <h5 class="loc-name">${createdAt}</h5>
                    </div>
                    </div>
                    <div class="loc-btns flex align-center justify-center">
                        <button onclick="onGoToLoc(${lat} , ${lng}, '${name}', '${address}')">go</button>
                        <button onclick="onDeleteLoc('${id}',' ${name}')">delete</button>
                    </div>
                
                </div>
                        `
            })
            document.querySelector('.location-table').innerHTML = strHTMLs.join('')
        }
        )
}

function onCodeAddress(ev) {
    ev.preventDefault()
    mapService.codeAddress()
}

function onSaveLoc(ev) {
    const locName = document.querySelector('input.loc-name').value
    const { lat, lng } = mapService.getCurrLoc().coords
    const address = mapService.getCurrLoc().address

    locService.createLoc(locName, address, lat, lng,)

    renderLocationTable()
    mapService.addMarker({ lat: lat, lng: lng })

    closeInfoWindow()
}

function onMyLoc() {
    const currPos = locService.loadCurrPos()

    mapService.panTo(currPos.lat, currPos.lng);
    onGetWaether(currPos.lat, currPos.lng)
}

function onCopyLoc() {
    getPosition()
        .then((pos) => {
            return window.location.href + `?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        })
        .then(url => {
            navigator.clipboard.writeText(url)
            alert(url)
        })
}

function getQueryParams() {
    const url = new URL(window.location.href)
    const searchParams = url.searchParams

    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    return { lat, lng }
}

function onDeleteLoc(id) {
    locService.deleteLoc(id)
    renderLocationTable()
    renderMarkers()
}

function renderChosenLocAddress(address) {

    document.querySelector('.chosen-loc').innerText = `${address}`

}

function onGetWaether(lat, lng) {
    weatherService.getWeather(lat, lng)
        .then(res => {
            console.log(res)
            getElement('.weather-location').innerText = res.data.name
            getElement('.temp').innerText = res.data.main.temp.toFixed(0)
            getElement('.wind').innerText = `wind speed: ${res.data.wind.speed}`
            getElement('.sky').innerText = `sky: ${res.data.weather[0].main}`
        })
        .catch(() => console.log('Weather API failure'))
}

function getElement(selector) {
    return document.querySelector(selector)

}

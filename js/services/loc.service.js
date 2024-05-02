import { mapService } from './map.service.js';
import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
    getLocs,
    createLoc: saveLoc,
    saveCurrLoc: saveUserLoc,
    loadCurrPos: loadUserLoc,
    deleteLoc,
}

const LOCS_STORAGE_KEY = 'locsDB';
const USER_LOC_STORAGE_KEY = 'userlocDB';

const defaultLocs = [
    { id: 'sdgs', name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: '3.11.2022', },
    { id: 'sfsdgs', name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: '3.11.2022', },
]


var gLocs = storageService.load(LOCS_STORAGE_KEY) || defaultLocs
var gUserCurrPos


function getLocs() {
    if (gLocs) return Promise.resolve(gLocs);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(defaultLocs);
        }, 2000);
    });
}

function saveLoc(
    name,
    address,
    lat,
    lng,
    id = utilService.makeId(),
    createdAt = utilService.createDate()
) {
    // var locs = [{ id: 1, name: home, lat: 11.22, lng: 22.11, createdAt: 1519211810362 }]
    if (lat && lng) gLocs = [{ name, address, lat, lng, createdAt, id, }, ...gLocs]
    storageService.save(LOCS_STORAGE_KEY, gLocs)
    return gLocs
}

function saveUserLoc(pos) {
    storageService.save(USER_LOC_STORAGE_KEY, pos)
}

function loadUserLoc() {
    return storageService.load(USER_LOC_STORAGE_KEY)
}

function deleteLoc(id) {
    const locIdx = gLocs.findIndex(loc => {
        return loc.id === id
    })

    mapService.removeMarker(gLocs[locIdx].name)
    gLocs.splice(locIdx, 1)
    storageService.save(LOCS_STORAGE_KEY, gLocs)
}
import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
    getLocs,
    createLoc: saveLoc,
    saveCurrLoc: saveUserLoc,
    loadCurrPos: loadUserLoc,
}

const LOCS_STORAGE_KEY = 'locsDB';
const USER_LOC_STORAGE_KEY = 'userlocDB';


var gLocs = storageService.load(LOCS_STORAGE_KEY) || []
var gUserCurrPos

const defaultLocs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
    if (gLocs) return Promise.resolve(gLocs);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(defaultLocs);
        }, 2000);
    });
}

//function that create a new Loc, and adding it to the Locs array
function saveLoc(
    name,
    address,
    lat,
    lng,
    id = utilService.makeId(),
    createdAt = utilService.createDate()
) {
    // var locs = [{ id: 1, name: home, lat: 11.22, lng: 22.11, createdAt: 1519211810362 }]
    if (lat && lng) gLocs = [...gLocs, { name, address, lat, lng, createdAt, id, }]
    storageService.save(LOCS_STORAGE_KEY, gLocs)
    return gLocs
}

function saveUserLoc(pos) {
    storageService.save(USER_LOC_STORAGE_KEY, pos)
}

function loadUserLoc() {
    return storageService.load(USER_LOC_STORAGE_KEY)

}
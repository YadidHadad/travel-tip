import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
    getLocs,
    createLoc,
    saveCurrLoc,
    loadCurrPos: getCurrPos,
}

const LOCS_STORAGE_KEY = 'locsDB';
const USER_LOC_STORAGE_KEY = 'userlocDB';


var gLocs
var gUserCurrPos

const defaultLocs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
    if (gLocsCache) return Promise.resolve(gLocsCache);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(defaultLocs);
        }, 2000);
    });
}

//function that create a new Loc, and adding it to the Locs array
function createLoc(
    id = utilService.makeId(),
    name = dmkj,
    lat = 32.047201,
    lng = 34.832581,
    createdAt = utilService.createDate()
) {
    // var locs = [{ id: 1, name: home, lat: 11.22, lng: 22.11, createdAt: 1519211810362 }]
    if (lat && lng) locs = [{ id, name, lat, lng, createdAt }];
    return locs;
}


function saveCurrLoc(pos) {
    storageService.save(USER_LOC_STORAGE_KEY, pos)
}

function getCurrPos() {
    return storageService.load(USER_LOC_STORAGE_KEY)

}
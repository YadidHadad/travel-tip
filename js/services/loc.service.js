import { storageService } from './services/storage.service.js';
import { utilService } from './services/util.service.js';

export const locService = {
  getLocs,
  setLocs,
};

const STORAGE_KEY = 'locsDB';
var gLocsCache = storageService.load(STORAGE_KEY);
const locs = {};

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
function setLocs(
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

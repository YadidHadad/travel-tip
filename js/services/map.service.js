export const mapService = {
	initMap,
	addMarker,
	panTo,
	addEventListener,
	codeAddress,
	getCurrLoc,
	removeMarker,
	reverseCodeAddress,
	getMap,
	saveCurrLoc,
}

// Var that is used throughout this Module (not global)
var gMap
var gGeocoder
var gCurrLoc
var gMarkers = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
	console.log('InitMap')
	return _connectGoogleApi().then(() => {
		console.log('google available')
		gGeocoder = new google.maps.Geocoder()
		console.log(`gGeocoder:`, gGeocoder)
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 15,
		})
		console.log('Map!', gMap)

		return gMap
	})
}

function getMap() {
	return gMap
}

function getCurrLoc() {
	return gCurrLoc
}

function addMarker(pos, name, icon) {
	const url = icon === 'home' ? './img/location-pin.png' : './img/flag.png'

	var marker = new google.maps.Marker({
		position: pos,
		map: gMap,
		title: name,
		icon: {
			// size: new google.maps.Size(40, 40),
			scaledSize: new google.maps.Size(40, 40),
			url: url,
		},
	})

	gMarkers.push(marker)
	console.log(`gMarkers:`, gMarkers)
	return marker
}
function removeMarker(name) {
	console.log(`name:`, name)
	const markerIdx = gMarkers.findIndex((marker) => marker.title === name)
	if (markerIdx > -1) gMarkers[markerIdx].setMap(null)

	gMarkers.splice(markerIdx, 1)
	console.log(gMarkers)
}

function panTo(lat, lng) {
	var laLatLng = new google.maps.LatLng(lat, lng)
	gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
	if (window.google) return Promise.resolve()

	const MAPS_KEY = 'API_KEY_PLACEHOLDER'

	if (WEATHER_API === 'API_KEY_PLACEHOLDER') console.log('KEY IS NOT UPDATED')

	var elGoogleApi = document.createElement('script')

	elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&language=en`
	elGoogleApi.async = true
	document.body.append(elGoogleApi)

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve
		elGoogleApi.onerror = () => reject('Google script failed to load')
	})
}

function codeAddress() {
	var address = document.getElementById('address').value
	gGeocoder.geocode({ address: address }, function (results, status) {
		if (status == 'OK') {
			gMap.setCenter(results[0].geometry.location)
			var marker = new google.maps.Marker({
				map: gMap,
				position: results[0].geometry.location,
			})
		} else {
			alert(
				'Geocode was not successful for the following reason: ' + status
			)
		}
	})
}

function reverseCodeAddress(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng)
	// This is making the Geocode request
	const address = gGeocoder.geocode({ latLng: latlng }, (results, status) => {
		var address

		if (status !== google.maps.GeocoderStatus.OK) {
			alert(status)
		}
		// This is checking to see if the Geoeode Status is OK before proceeding
		if (status == google.maps.GeocoderStatus.OK) {
			address = results[0].formatted_address
		}
		return address
	})

	return address
}

function saveCurrLoc(obj) {
	gCurrLoc = obj
}

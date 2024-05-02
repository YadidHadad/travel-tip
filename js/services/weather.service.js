export const weatherService = {
    getWeather,

}

const WEATHER_API = ${{secrets.WEATHER_KEY}}
// const WEATHER_API = 'cca6c2803bb413e19be59f3727b3bf01'

function getWeather(lat = 34.0, lng = 35.0) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_API}&units=metric`)
}

const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = "https://api.darksky.net/forecast/<YOUR_KEY_HERE>/" + encodeURIComponent(latitude) + "," + encodeURIComponent(longitude)
    request({url, json: true}, (error, {body}) => {
        if(error){
            callback("Unable to connect", undefined)
        }else if(body.error){
            callback("Malformed URL", undefined)
        }else{
            callback(undefined, body.daily.data[0].summary + " The current temperature is " + body.currently.temperature + " and there is " + 
                     body.currently.precipProbability +"% chance of rain")
        }
    })
}

module.exports = forecast

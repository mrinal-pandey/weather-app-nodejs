const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const viewsPath = path.join(__dirname, "../templates/views")
const publicDirectoryPath = path.join(__dirname, "../public")
const partialsPath = path.join(__dirname, "../templates/partials")

// Set up hbs engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Matches up html name from url and loads the page at specified directory for static content
// everything static, this is the first directory which is looked up
app.use(express.static(publicDirectoryPath))

// routes for dynamic pages(hbs)
app.get('/', (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Mrinal"
    }) // accesses index.hbs as name matches
})

app.get('/about', (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Mrinal"
    }) // accesses about.hbs as name matches and so on
})

app.get('/help', (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Mrinal",
        helpMessage: "Google it :p"
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send(
            {
                error: "Please provide an address"
            }
        )
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send(
                {
                    error
                }
            )
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send(
                    {
                        error
                    }
                )
            }
            res.send(
                {
                    location,
                    forecastData
                }
            )
        })
    })
})

//req.query has all the queries passed in url as key: value pairs
app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send(
            {
                error: "Please search something"
            }
        )
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render("error", {
        title: "404",
        errorMessage: "Help not found",
        name: "Mrinal"
    })
})

app.get('/*', (req, res) => {
    res.render("error", {
        title: "404",
        errorMessage: "404 not found",
        name: "Mrinal"
    })
})

// start the app on port 3000
app.listen(port, () => {
    console.log("Server is up on port " + port)
})

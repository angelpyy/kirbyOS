var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var path = require("path");
var server = require('http').createServer(app);
var io = require('socket.io') (server);

// WEBHOOK //
app.post('/webhook', function(req, res) {
    console.log('received post request');
    if(!req.body) return res.sendStatus(400)
    res.setHeader('content-type', 'application/json');
    console.log('here is the post request from dialogflow');
    console.log(req.body);
    console.log('got geo city from dialogflow ' + req.body.queryResult.parameters['geo-city']);
    var city = req.body.queryResult.parameters['geo-city'];
    var w = getWeather(city);
    let response = " ";
    let responseObj = {
        "fullfilmentText" : response,
        "fulfillmentMessage" : [{"text" : {"text" : [W]}}],
        "source" : ""
    }
    console.log('Here is the response to dialogflow');
    console.log(responseObj);
    return res.json(responseObj);
});

// WEATHER API //
var apiKey = '9869101629d5f71302c27da173ba09f5';
var result

function cb(err, response, body) {
    if(err) {
        console.log('error:', error);
    }
    var weather = JSON.parse(body)

    if (weather.message === 'city not found') {
        result = 'unable to get weather' + weather.message;
    }
    else {
        result = 'right now it is ' + weather.main.temp + ' degrees with ' + weather.weather[0].description;
    }
}

function getWeather(city) {
    result = undefined;
    var url = 'api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}';
    console.log(url);
    var req = request(url, cb);
    while (result === undefined) {
        require('deasync').runLoopOnce();
    }
    return result;
}

/*
// demo? // 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname.'/kirbyOS.html'));
})
io.on('connection', function(client) {
    console.log('socket conenction established');
    client.on('SendLocation', function(data) {
        console.log('location received');
        console.log(data);
        var w = getWeather(data);
    })
});
*/
// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


app.get('/', function(req, res) {
   res.send('Hello there');
});

app.get('/get', (req, res) => {
   res.send(projectData);
});

app.post('/post', (req, res) => {
   let data = {}
   data['temperature'] = req.body.temperature;
   data['date'] = req.body.date;
   data['entry'] = req.body.entry;
   projectData = data;

});

// Setup Server
const port = 3000;
app.listen(port, () => {
   console.log(`Listening on port ${port}`);
});

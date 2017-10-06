const path = require('path');

// Initialise express and webpack instances
var express = require('express');
var app = express();

// Trimming env variable for global use
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : process.env.NODE_ENV;

// Serve Static Content
app.use(express.static(__dirname + '/src/build'));

// app.use('/dist', express.static(__dirname + '/src/build/dist'));
// app.use('/css', express.static(__dirname + '/../client/css'));


    app.get('/*', function (request, response, next) {
            response.sendFile(path.join(__dirname + '/src/build/index.html'));
    });

// app.use('/api', dataAPI);

app.listen(9000, () => {
    console.log('Server listening to 9000 port.');
});

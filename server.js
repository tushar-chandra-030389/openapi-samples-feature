const path = require('path');

var express = require('express');
var app = express();

// Serve Static Content
app.use(express.static(__dirname + '/public/build'));

    app.get('/*', function (request, response, next) {
            response.sendFile(path.join(__dirname + '/public/build/index.html'));
    });

app.listen(9000, () => {
    console.log('Server listening to 9000 port.');
});

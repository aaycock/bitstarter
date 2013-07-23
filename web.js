var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var mimeTypes = {'html': 'text/html', 'png': 'image/png',
    'js': 'text/javascript', 'css': 'text/css'};

function processRequest(request, response) {
    "use strict";
    var uri, filename;
    uri = url.parse(request.url).pathname;
    filename = path.join(process.cwd(), uri);
    // SECURITY HOLE: Check for invalid characters in filename.
    // SECURITY HOLE: Check that this accesses file in CWD's hierarchy.
    fs.exists(filename, function (exists) {
        var extension, mimeType, fileStream;
        if (exists) {
            extension = path.extname(filename).substr(1);
            mimeType = mimeTypes[extension] || 'application/octet-stream';
            response.writeHead(200, {'Content-Type': mimeType});
            console.log('serving ' + filename + ' as ' + mimeType);

            fileStream = fs.createReadStream(filename);
            fileStream.pipe(response);
        } else {
            console.log('not exists: ' + filename);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
        }
    }); //end path.exists
}

http.createServer(processRequest).listen(8080);

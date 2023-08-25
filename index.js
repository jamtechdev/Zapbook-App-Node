const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const path = require('path');
require('dotenv').config();



/* Include the Sockets file */
const initializeSocket = require('./sockets/MainSocket');
/*End */
/* Calling of Socetks method which will provide data  */
initializeSocket(server);
/* End */

/* Basic view file to check the data is comming from socket or not */
app.get('/', (req, resp) => {
    var option = {
        root: path.join(__dirname + "/resources/views/")
    }
    var file_name = 'index.html';
    resp.sendFile(file_name, option)
});


const port = process.env.PORT || 4500;
server.listen(port, () => {
    console.log(`INFO  Server running on  [http://localhost:${port}]`);
    console.log("\x1b[33m%s\x1b[0m", "Press Ctrl+C to stop the server");
});



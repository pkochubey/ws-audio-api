var fs = require("fs");
var WebSocketServer = require('ws').Server;

var wsPort = 5000;
var masterId = 0;
var listeners = {};

var wss = new WebSocketServer({ port: wsPort });

wss.on('connection', function (ws) {
    console.log(ws.upgradeReq)
    var connectionId = masterId + 1;
    var isMaster = false;

    if (connectionId == 1) {
        masterId = connectionId;
        isMaster = true;
        ws.on('message', function (message) {
            for (var cid in listeners) {
                listeners[cid].send(message, {
                    binary: true
                }, function (err) {
                    if (err) {
                        console.log('Error: ', err);
                    }
                });
            }
        });
        console.log('Speaker connected');
    } else {
        listeners[connectionId] = ws;
        isMaster = false;
        console.log('Listener connected');
    }

    ws.on('close', function () {
       if (isMaster) {
           masterId = null;
           console.log('Speaker disconnected');
       } else {
           delete listeners[connectionId];
           console.log('Listener disconnected');
       }
    });
});

console.log('Listening on port:', wsPort);

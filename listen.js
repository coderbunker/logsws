var pg = require ('pg');
var config = require('./config.js');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.port });

wss.on('connection', function connection(ws) {
  pg.connect(config.pgdb, function(err, client) {
    if(err) {
      console.log(err);
    }
    client.on('notification', function(msg) {
      console.log(msg);
      ws.send(msg.payload);
    });
    var query = client.query("LISTEN systemevents");
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});


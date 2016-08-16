var pg = require ('pg');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8000 });

wss.on('connection', function connection(ws) {
  var pgConString = "postgres://app:YOURPASSWORD@localhost/rsyslogpgsql"

  pg.connect(pgConString, function(err, client) {
    if(err) {
      console.log(err);
    }
    client.on('notification', function(msg) {
      console.log(msg);
      var payload = JSON.parse(msg.payload);
      Object.keys(payload).forEach(function (key) {
          console.log(key, payload[key]);
      });
      ws.send(msg.payload);
    });
    var query = client.query("LISTEN systemevents");
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

  });
});


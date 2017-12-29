
//DOCS https://gist.github.com/bzy-xyz/9c4d8c9f9498a2d7983d
// https://github.com/sockjs/sockjs-client


const fs = require("fs");
const request = require("request");
var WebSocketClient = require('websocket').client;

var d = fs.readFileSync("secret.pass");
var creds = JSON.parse(d);

const URL = "https://screeps.com/api";
const AUTH = URL + "/auth/signin";

const PLAYER_ID = '5a3625718627be33bce3ab1b';

var options = {
    url: AUTH,
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      email: creds.email,
      password: creds.password
    })
}


function wrap(str) {
  return "[\"" + str + "\"]";
}

request(options, function (error, response, body) {
  let data = JSON.parse(body);
  let token = data.token;

  var socket = new WebSocketClient();

  socket.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
  });

  socket.on('connect', function(connection) {
    console.log('Connected!');

    connection.on('message', function(message) {
      if(message.utf8Data == 'o') {
        console.log('Channel open');
        console.log('Sending ' + "auth " + token);
        connection.sendUTF(wrap("auth " + token));
      } else if (message.utf8Data.startsWith('a["auth ok')) {
        console.log('Authenticated');
        connection.sendUTF(wrap("subscribe user:" + PLAYER_ID + "/cpu"));
      } else if (message.utf8Data.startsWith('a["[')) {
        var msg = message.utf8Data
          .replace(/\\/g, "")
          .replace(/a\[\"/g, "");
        msg = msg.substring(0, msg.length - 2);

        var data = JSON.parse(msg);
        console.log("CPU " + data[1].cpu);

      } else {
        console.log(message);
      }
    })
  });

  socket.connect('wss://screeps.com/socket/123/abcdefgh/websocket');
});

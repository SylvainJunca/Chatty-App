// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3002;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});

const colors = ['#AA3C39', '#2813A8', '#009B00', '#B70080'];

const createMessage = (message) => {
  const match = message.content.match(/^\/giphy (\w)+/);
  if (match) {
    message.content = 'GIF request detected';
  }
  message.type = 'incomingMessage';
  message.id = uuidv1();
  return (JSON.stringify(message));
}

const createNotification = (notification) => {
  notification.type = 'incomingNotification';
  notification.id = uuidv1();
  return (JSON.stringify(notification));
}

const sendNumberUsers = (data) => {
  return (JSON.stringify(data))
}

const log = (username, logMessage) => {
  const notif = {
    content: `${username} ${logMessage}`
  }
  return createNotification(notif);
}

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.broadOthers = function broadcast(data, ws) {
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};



// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  //console.log('Client connected :', wss.clients.size);

  // Sends the number of clients connected when someone
  // connects to the chatty app
  const numberUsers = {
    type: 'numberUsers',
    'numberUsers': wss.clients.size
  };
  wss.broadcast(sendNumberUsers(numberUsers));
  let clientName = 'Someone';

  wss.broadOthers(log(clientName, 'joins the channel'), ws);
  // Assigns a color from the array of colors
  const colorAssigned = {
    type: 'color',
    'color': colors.shift()
  }
  colors.push(colorAssigned.color);
  ws.send(JSON.stringify(colorAssigned));


  ws.on('message', function incoming(data) {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'postMessage':
        wss.broadcast(createMessage(message));
        break;
      case 'postNotification':
        wss.broadcast(createNotification(message));
        clientName = message.name;
        console.log(message)
        break;
      default:

    }

  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', (event) => {
    console.log(event);
    console.log('Client disconnected')
    const numberUsers = {
      type: 'numberUsers',
      'numberUsers': wss.clients.size
    };
    wss.broadcast(sendNumberUsers(numberUsers))
    wss.broadOthers(log(clientName, 'has left the channel'), ws)
  });
});
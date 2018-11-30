// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const fetch = require("node-fetch");
const giphyKey = require('./secret');

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

const colors = ['#9400D3', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'];

// This function is triggered when the user enter the command '/giphy'
// It gets a random gif based on the keywords entered by the user
// and send it to the chat 

const giphyBot = async (keyWord) => {
  const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${ giphyKey.GIPHY_KEY }&tag=${ keyWord[1] }&rating=G`)
  const json = await response.json();

  return json.data ?
    json.data.images.downsized.url :
    './src/docs/GifBot-error.png';
}

// This function creates a message before sending it back to the client 
// It differenciates if it is a regular message or a command to use the gif bot
const createMessage = async function (message) {
  message.type = 'incomingMessage';
  message.id = uuidv1();
  // Regex to check if the user enters the command to trigger the bot giphy
  const match = message.content.match(/^\/giphy (\w.+)$/);
  if (match) {
    message.gif = await giphyBot(match)
    return (JSON.stringify(message));
  } else {
    return (JSON.stringify(message));
  }

}

// This function handles the notifications sent back to the clients 

const createNotification = (notification) => {
  notification.type = 'incomingNotification';
  notification.id = uuidv1();
  return (JSON.stringify(notification));
}

// This function sends the number of users connected to the client
// It is triggered each time someone enters or leave the chat
const sendNumberUsers = (data) => {
  return (JSON.stringify(data))
}
// this function creates the notifications sent to everybody each 
// time someone enters or leave the chat
const log = (username, logMessage) => {
  const notif = {
    content: `${username} ${logMessage}`
  }
  return createNotification(notif);
}

// When we want to send a message or notification to everybody, we use 
// the following function
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// When we want to send a message or notification to everybody except the
// actual client, we use the following function
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

  // Sends the number of clients connected when someone
  // connects to the chatty app
  const numberUsers = {
    type: 'numberUsers',
    'numberUsers': wss.clients.size
  };
  wss.broadcast(sendNumberUsers(numberUsers));
  let clientName = 'Someone';

  wss.broadOthers(log(clientName, 'joins the channel'), ws);
  ws.send(createNotification({
    content: `Welcome to Chatty App, you should change your username to let people know who you are.
    This app comes with a nice bot named Giphy Bot that send a random GIF based on the keyword you enter.
    For example, to send a cat GIF just type: '/giphy cat`
  }));

  // Assigns a color from the array of colors to the users
  // when they login for the first time 
  const colorAssigned = {
    type: 'color',
    'color': colors.shift()
  }
  colors.push(colorAssigned.color);
  ws.send(JSON.stringify(colorAssigned));

  // This establishes the connection with the client 
  ws.on('message', async function incoming(data) {
    const message = JSON.parse(data);

    // Depending on the type of message received, we are going to treat 
    // the data differently by calling 2 distinct functions
    switch (message.type) {
      case 'postMessage':
        const x = await createMessage(message)
        wss.broadcast(x);
        break;
      case 'postNotification':
        wss.broadcast(createNotification(message));
        clientName = message.name;

        break;
      default:

    }

  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', (event) => {

    console.log('Client disconnected')
    const numberUsers = {
      type: 'numberUsers',
      'numberUsers': wss.clients.size
    };
    // When someone leaves the chat, we reactualize the number of users connected
    // and send a notification to inform the other users the person left
    wss.broadcast(sendNumberUsers(numberUsers))
    wss.broadOthers(log(clientName, 'has left the channel'), ws)
  });
});
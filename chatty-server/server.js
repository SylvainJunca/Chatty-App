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

const colors = ['#AA3C39', '#2813A8', '#009B00', '#B70080'];

const giphyBot = async (keyWord) => {
  const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${ giphyKey.GIPHY_KEY }&tag=${ keyWord[1] }&rating=G`)
  const json = await response.json();
  if (json.data) {
    const gif = json.data.images.downsized.url;
    console.log(gif);
    return ({
      __html: `<img src='${gif}' />`
    });
  } else {
    return ({
      __html: `<span> Oh no, I tried to use Giphy to send a gif of ${keyWord[1]} but the server seem to not respond :'(</span>`
    });
    // const notification = {
    //   content: 'Oups Giphy Bot is sleeping at the moment, please try again later'
    // };
    // returncreateNotification(notification);
  }

}


// return {
//   __html: `First &middot; Second`
// }
// return Promise.resolve({
//   __html: `<img src='https://media1.giphy.com/media/DU0aEm71P3Te8/giphy-downsized.gif' />`
// });
// console.log(`https://api.giphy.com/v1/gifs/random?api_key=${ giphyKey.GIPHY_KEY }&tag=${ keyWord[1] }&rating=G`);
// return fetch(`https://api.giphy.com/v1/gifs/random?api_key=${ giphyKey.GIPHY_KEY }&tag=${ keyWord[1] }&rating=G`)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (giphy) {
//     gif = giphy.data.images.downsized.url;
//     return {
//       __html: `First &middot; Second`
//     }
//     // return ({
//     //   __html: `<img src='${gif}' />`
//     // });
//   })
//   .catch((error) => console.error(error))


const createMessage = async function (message) {
  message.type = 'incomingMessage';
  message.id = uuidv1();
  // Regex to check if the user enters the command to trigger the bot giphy
  const match = message.content.match(/^\/giphy (\w.+)$/);
  if (match) {
    console.log('message');

    message.gif = await giphyBot(match)
    return (JSON.stringify(message));
  } else {
    return (JSON.stringify(message));
  }

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


  ws.on('message', async function incoming(data) {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'postMessage':
        const x = await createMessage(message)
        wss.broadcast(x);
        break;
      case 'postNotification':
        wss.broadcast(createNotification(message));
        clientName = message.name;
        //console.log(message)
        break;
      default:

    }

  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', (event) => {
    //console.log(event);
    console.log('Client disconnected')
    const numberUsers = {
      type: 'numberUsers',
      'numberUsers': wss.clients.size
    };
    wss.broadcast(sendNumberUsers(numberUsers))
    wss.broadOthers(log(clientName, 'has left the channel'), ws)
  });
});
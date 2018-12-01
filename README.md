Chatty App
=====================

A minimal and light dev environment for ReactJS.

## Final Product

!["Screenshot of main page 01"](https://github.com/SylvainJunca/Chatty-App/blob/master/build/Chatty-App-desktop02.png?raw=true)
!["Screenshot of main page 02"](https://github.com/SylvainJunca/Chatty-App/blob/master/build/Chatty-App-desktop03.png?raw=true)
!["Screenshot of smartphone 01"](https://github.com/SylvainJunca/Chatty-App/blob/master/build/Chatty-App-smartphone01.png?raw=true)
!["Screenshot of smartphone 02"](https://github.com/SylvainJunca/Chatty-App/blob/master/build/Chatty-App-smartphone02.png?raw=true)


### Installation

Install the dependencies and start the websocket server.

```
cd chatty-server
npm install
npm start
```
if you want to be able to use GiphyBot, you need to add a file secret.js in the chatty-server folder containing a key for the Giphy API like this example : 
```
module.exports = {
  GIPHY_KEY: "YOUR_OWN_API_KEY_HERE"
};
```

Install the dependencies and start the front-end server server.

```
npm install
npm start
open http://localhost:3000
```

### Features 

- You can enter the app and share text messages with other people connected
- Each user can be recognized by its own color
- You can change your username anytime
- The app automatically scrolls down to the last message
- You can share GIFs by using the command : /giphy keyword1 keyword2 ...
- The app is designed to display correctly even on smaller devices
- The app shows the number of user connected
- The app informs users when :
- * someone enters the chat
- * someone change their username
- * someone leaves the chat

### Dependencies

#### Server 

* "express": "4.16.4",
*   "uuid": "^3.3.2",
*   "ws": "6.1.2"

#### Chatty App

* "node-fetch": "^2.3.0",
*    "react": "15.4.2",
*   "react-dom": "15.4.2",
*   "ws": "6.1.2"

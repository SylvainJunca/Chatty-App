import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: 0,
      currentUser: {name: 'Anonymous', color: '#000000'}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
    this.socket = new WebSocket("ws://localhost:3002");
  };
  componentDidMount() {

    this.socket.onopen = function (e) {
      console.log("connected to " + e.currentTarget.url);
    };
    this.socket.onmessage = (event) => {
      console.log("Received from websocket :", event.data);
      const mess = JSON.parse(event.data);

      if (mess.type === 'numberUsers') {
        this.setState({users : mess.numberUsers});
      } else if (mess.type === 'color') {
        // console.log('color assigned', mess.color);
        this.setState({currentUser: {...this.state.currentUser, color : mess.color}})
      } else {
      const messages = this.state.messages.concat(mess);
      this.setState({messages: messages}); 
      };
      //console.log(`${mess.username} says ${mess.content}`);
    };
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    //   const messages = this.state.messages.concat(newMessage)
    //   // Update the state of the app component.
    //   // Calling setState will trigger a call to render() in App and all child components.
    //   this.setState({messages: messages})
    // }, 3000);
  }
  updateUsername = (username) => {
    const notification = {type: 'postNotification', content : `${this.state.currentUser.name} changed their name to ${username}`}
    this.socket.send(JSON.stringify(notification));
    this.setState({currentUser: {...this.state.currentUser, name : username}})
  }

  addMessage = (content) => {
    const message = {type: 'postMessage', name: this.state.currentUser.name, color: this.state.currentUser.color, content: content};
    //const messages = this.state.messages.concat(message);
    //this.setState({messages: messages}); 
    //console.log('adding message', message)
    this.socket.send(JSON.stringify(message));
  }

  render() {
    return (
      <div>
        <NavBar numberUsers = {this.state.users} />
        <MessageList messages = {this.state.messages}/>
        <ChatBar user = {this.state.currentUser.name} addMessage={this.addMessage} updateUsername={this.updateUsername}/>
      </div>
    );
  }
}
export default App;

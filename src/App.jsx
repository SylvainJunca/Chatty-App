import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
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
      const messages = this.state.messages.concat(mess);
      this.setState({messages: messages}); 
      console.log(`${mess.username} says ${mess.content}`);
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
  
  addMessage = (content) => {
   
    const message = {username: this.state.currentUser.name, content: content};
    //const messages = this.state.messages.concat(message);
    //this.setState({messages: messages}); 
    console.log('adding message', message)
    this.socket.send(JSON.stringify(message));
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = {this.state.messages}/>
        <ChatBar user = {this.state.currentUser} addMessage={this.addMessage}/>
      </div>
    );
  }
}
export default App;

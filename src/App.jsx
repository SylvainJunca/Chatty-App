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

      this.scrollToBottom();
      //console.log(`${mess.username} says ${mess.content}`);
    };
    
  }
  
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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
        <div>
          <MessageList messages = {this.state.messages}/>
          <div style={{ float: "left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <ChatBar user = {this.state.currentUser.name} addMessage={this.addMessage} updateUsername={this.updateUsername}/>
      </div>
    );
  }
}
export default App;

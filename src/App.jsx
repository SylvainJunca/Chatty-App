import React, {Component} from 'react';
import MessageList from './MessageList.jsx';


class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList />
          <footer className="chatbar">
            <input className="chatbar-username" placeholder="Your Name (Optional)" />
            <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
          </footer>
      </div>
    );
  }
}
export default App;

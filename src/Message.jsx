import React, { Component} from 'react';

export default class Message extends Component {
  constructor({type, username, content}){
    super();
    this.type = type;
    this.username = username;
    this.content = content;
  }
  render (){ 
    if (this.type == "incomingMessage") {
        return(
          <div className="message">
            <span className="message-username">{this.username}</span>
            <span className="message-content">{this.content}</span>
          </div>
        );
      }
    if (this.type == "incomingNotification") {
        return(
          <div className="notification">
            <span className="notification-content">{this.content}</span>
          </div>
        );
    }
    
  }
} 


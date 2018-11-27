import React, { Component} from 'react';

export default class Message extends Component {
  constructor({username, content}){
    super();
    this.username = username;
    this.content = content;
  }
  render (){ 
   return(
     <div className="message">
       <span className="message-username">{this.username}</span>
       <span className="message-content">{this.content}</span>
     </div>
   );
  }
} 


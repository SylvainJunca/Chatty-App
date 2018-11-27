import React, { Component} from 'react';

export default class ChatBar extends Component {
  render (){ 
    if(this.props.user){
    return(
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.user.name} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
    </footer>)

  }
   return(
    <footer className="chatbar">
      <input className="chatbar-username" placeholder="Your Name (Optional)" />
      <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
  </footer>
   );
  }
} 









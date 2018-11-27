import React, { Component} from 'react';

export default class ChatBar extends Component {
  handleInputMessage = (e)  => {
    if(e.keyCode == 13){
      console.log(e.target.value);
      this.props.addMessage(e.target.value);
      e.target.value = '';
    }
  }

  render (){ 
    return(
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.user ? this.props.user.name : "Your name (Optional)"} />
        <input onKeyUp={this.handleInputMessage} className="chatbar-message" placeholder="Type a message and hit ENTER" />
    </footer>)

  
  } 
}
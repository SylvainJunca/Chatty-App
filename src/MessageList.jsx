import React, { Component} from 'react';
import Message from './Message.jsx';

export default class MessageList extends Component {
  render (){
    const listMess = this.props.messages.map((message) => <Message username={message.username} content={message.content}/>);
   return (
    <main className="messages">
      {listMess}
    </main>
  );
  }
} 



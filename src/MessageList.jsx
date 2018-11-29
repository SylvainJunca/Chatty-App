import React, { Component } from 'react';
import Message from './Message.jsx';

export default class MessageList extends Component {
	render() {
		const listMess = this.props.messages.map((message) => {
			return (
				<Message
					key={message.id}
					type={message.type}
					username={message.name}
					color={message.color}
					content={message.content}
				/>
			);
		});
		return <main className="messages">{listMess}</main>;
	}
}

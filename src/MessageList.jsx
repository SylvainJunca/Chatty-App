import React, { Component } from 'react';
import Message from './Message.jsx';

const MessageList = ({ messages, scrollToBottom }) => (
	<main className="messages" style={{ height: 'calc(100vh - 62px - 70px)', 'overflow-y': 'auto' }}>
		{messages.map((message) => (
			<Message
				key={message.id}
				type={message.type}
				username={message.name}
				color={message.color}
				content={message.content}
				gif={message.gif}
				scrollToBottom={scrollToBottom}
			/>
		))}
	</main>
);

export default MessageList;

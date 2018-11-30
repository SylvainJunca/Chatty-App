import React, { Component } from 'react';

const Message = ({ type, username, color, content, gif, scrollToBottom }) => {
	if (type == 'incomingMessage') {
		if (gif) {
			return (
				<div className="message">
					<span className="message-username" style={{ color: color }}>
						{username}
					</span>
					<img className="message-content" src={gif} onLoad={scrollToBottom} />
				</div>
			);
		}
		return (
			<div className="message">
				<span className="message-username" style={{ color: color }}>
					{username}
				</span>
				<span className="message-content">{content}</span>
			</div>
		);
	}
	if (type == 'incomingNotification') {
		return (
			<div className="notification">
				<span className="message-system">{content}</span>
			</div>
		);
	}
};

export default Message;

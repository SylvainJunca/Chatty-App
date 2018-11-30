import React, { Component } from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: 0,
			currentUser: {
				name: 'Anonymous',
				color: '#000000'
			},
			messages: []
		};
		this.socket = new WebSocket('ws://localhost:3002');
	}

	componentDidMount() {
		this.socket.onopen = function(e) {
			console.log('connected to ' + e.currentTarget.url);
		};
		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);

			if (message.type === 'numberUsers') {
				// if message received is type of numberUsers
				// we update the number of user in the state
				this.setState({
					users: message.numberUsers
				});
			} else if (message.type === 'color') {
				// if the message received is type of color
				// we update the color in the CurrentUser object
				this.setState({
					currentUser: {
						...this.state.currentUser,
						color: message.color
					}
				});
			} else {
				// By default, the message, sohuld it be a message or notification will be sent in
				// the messages array before being rendered
				const messages = this.state.messages.concat(message);
				this.setState({
					messages: messages
				});
			}
			this.scrollToBottom();
		};
	}
	componentDidUpdate() {
		this.scrollToBottom();
	}
	scrollToBottom = () => {
		this.messageEnd.scrollIntoView({
			behavior: 'smooth'
		});
	};

	updateUsername = (username) => {
		const notification = {
			type: 'postNotification',
			name: username,
			content: `${this.state.currentUser.name} changed their name to ${username}`
		};
		this.socket.send(JSON.stringify(notification));
		this.setState({
			currentUser: {
				...this.state.currentUser,
				name: username
			}
		});
	};

	addMessage = (content) => {
		const message = {
			type: 'postMessage',
			name: this.state.currentUser.name,
			color: this.state.currentUser.color,
			content: content
		};

		this.socket.send(JSON.stringify(message));
	};

	render() {
		return (
			<div>
				<NavBar numberUsers={this.state.users} />
				<div>
					<MessageList messages={this.state.messages} scrollToBottom={this.scrollToBottom} />
					<div
						ref={(el) => {
							this.messageEnd = el;
						}}
					/>
				</div>
				<ChatBar
					user={this.state.currentUser.name}
					addMessage={this.addMessage}
					updateUsername={this.updateUsername}
				/>{' '}
			</div>
		);
	}
}
export default App;

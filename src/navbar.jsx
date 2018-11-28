import React, { Component} from 'react';

export default class NavBar extends Component {
  
  render (){ 
        return(
          <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
            <span className="usersConnected">Users connected : {this.props.numberUsers}</span>
          </nav>
        );
} 
}

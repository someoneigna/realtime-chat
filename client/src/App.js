import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatContainer from './ChatContainer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    
    Notification.requestPermission()
    .then(result => this.setState({ notifications: result }));
  }

  getInitialState() {
    let state = {
      chatVisible: false,
      username: ''
    }
    return state;
  }

  initChat = (e) => {
    e.preventDefault();
    this.setState({ chatVisible: true });
  }

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  }

  render() {
    const loginChatStyle = {
      visibility: (this.state.chatVisible ? 'hidden' : 'visible'),
      margin: "1em 0"
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Realtime Chat</h2>
        </div>

        <form className="chatLogin" onSubmit={this.initChat} style={loginChatStyle}>
          <label htmlFor="nickname">Nickname</label>
          <input value={this.username} onChange={this.onUsernameChange} id="nickname" name="nickname" type="text" />
          <input type="submit" value="Log In"/> 
        </form>

          <section className="chatSection">
            <ChatContainer isVisible={this.state.chatVisible} username={this.state.username} notificationsEnabled={this.state.notifications} />
          </section>
      </div>
    );
  }
}

export default App;

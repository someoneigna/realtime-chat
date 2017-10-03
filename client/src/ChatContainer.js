import React from 'react';
import ChatInput from './ChatInput.js';
import ChatLog from './ChatLog.js';
import ChatUserlist from './ChatUserlist.js';
import './ChatContainerStyle.css';
import io from 'socket.io-client';
import axios from 'axios';

export default class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io();
        this.socket.on('users_status', (users) => {
            this.setState({ users: users });
        });        

        this.state = { username: undefined, users: [] };
    }

    sendMessage = (msg) => {                
        this.socket.emit('message', msg);     
        console.log("Sending:" + msg);        
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.username &&
             nextProps.username &&
             nextProps.isVisible) {
            this.socket.emit('connected', nextProps.username);
            this.setState({ username: nextProps.username });
        }
    }

    onUploadFile = (file) => {
        axios.post('/upload', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then()
        .catch(err => console.log('Error uploading file. ' + err))
    }

    render() {        
        const visibility = {
            visibility: (this.props.isVisible ? 'visible': 'hidden')
        }

        return(
            <div style={visibility} className="chatContainer">                
                <ChatLog className="chatLog" socket={this.socket} notifications={this.props.notificationsEnabled} />
                <ChatUserlist className="chatUserlist" socket={this.socket} users={this.state.users} />
                <ChatInput className="chatInput" sendMessage={this.sendMessage} onUpload={this.onUploadFile} />            
            </div>
        );
    }
}
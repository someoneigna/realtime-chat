import React from 'react';
import './ChatLogStyle.css';
import FileMessage from './FileMessage.js';

export default class ChatLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] }

        props.socket.on('message', (message) => {
            if (this.props.notifications && document.hidden) {
                const notification = new Notification(`${message.username} says`, { body: message.text });
            }
            this.addMessage(message)
        });

        props.socket.on('file_upload', (file) => {
            this.addMessage({ type:'file', url: file.url, name:file.name });
        });
    }

    addMessage = (message) => {
        this.state.messages.push(message)
        this.setState({ messages: this.state.messages })
    }

    renderMessages = () => {
        return this.state.messages.map((m, i) => {
            if (m.type === 'file') {
                return (
                    <li className="message" key={i}>
                        <FileMessage url={m.url} name={m.name} />
                    </li>
                )
            }
            
            return (
                <li className="message" key={i}>
                    <p className="username"><em>{m.username}</em></p>
                    <p className="messageText">{m.text}</p>
                </li>
            )
        })
    }

    render() {
        return(
            <div className="chatLog">
                <ul>
                    { this.renderMessages() }
                </ul>
            </div>
        );
    }
}
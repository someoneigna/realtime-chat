import React from 'react';
import './ChatLogStyle.css';

export default class ChatLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] }

        props.socket.on('message', (message) => {
            this.addMessage(message)
        })
    }

    addMessage = (message) => {
        this.state.messages.push(message)
        this.setState({ messages: this.state.messages })
    }

    renderMessages = () => {
        return this.state.messages.map((m, i) => {
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
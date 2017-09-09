import React from 'react';
import './ChatInputStyle.css';

export default class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { input: "" };
    }

    sendChat = (e) => {
        e.preventDefault();
        if (this.state.input.length !== 0) {
            this.props.sendMessage(this.state.input);
        }
        this.setState({ input: "" })
    }

    handleChange = (e) => {
        this.setState({ input: e.target.value });
    }

    checkInput = (e) => {
        if (e.keyCode === 13) {
            this.sendChat(e);
        }
    }

    render() {
        return(
            <div className="chatInput__parent">
                <div className="chatInput">
                    <input value={this.state.input} onChange={this.handleChange} className="inputField" name="message" type="text" placeholder="Message..." onKeyDown={this.checkInput} />
                    <input className="sendButton" type="button" value="Send" onClick={this.sendChat} />
                </div>
            </div>
            
        );
    }
}
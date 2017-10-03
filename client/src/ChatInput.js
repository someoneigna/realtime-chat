import React from 'react';
import './ChatInputStyle.css';
import UploadWidget from './UploadWidget';

export default class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            input: "",
            uploadWidgetOpen: false
        }
    }

    sendChat = (e) => {
        e.preventDefault();
        if (this.state.input.length !== 0) {
            this.props.sendMessage(this.state.input);
        }
        this.setState({ input: "" });
    }

    openSendImg = (e) => {
        e.preventDefault();
        this.setState({ uploadWidgetOpen: true });
    }

    closeSendImg = () => {
        this.setState({ uploadWidgetOpen: false });
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
                    <input className="inputField" value={this.state.input} onChange={this.handleChange} name="message" type="text" placeholder="Message..." onKeyDown={this.checkInput} />
                    <input className="sendButton" type="button" value="Send" onClick={this.sendChat} />
                    <input className="sendImage" type="button" value="Upload" onClick={this.openSendImg} />
                </div>
                <UploadWidget isVisible={this.state.uploadWidgetOpen} onClose={this.closeSendImg} onUpload={this.props.onUpload} />
            </div>
        );
    }
}
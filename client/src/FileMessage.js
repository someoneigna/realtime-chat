import React from 'react';
import axios from 'axios';

export default class FileMessage extends React.Component {    
    render() {
        return(
            <div className="fileMessage">
                <label>{this.props.name}</label>
                <a href={this.props.url} download={this.props.name}>Download</a>
            </div>
        )
    }
}
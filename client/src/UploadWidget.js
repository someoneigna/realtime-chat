import React from 'react';
import './UploadWidget.css';
import axios from 'axios';

export default class UploadWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filepath: "",
            file: null
        }
    }

    setFilepath = (filepath) => {
        console.log(JSON.stringify(filepath));
        let  filenameStart = filepath.lastIndexOf('/');
        if (filenameStart === -1) filenameStart = filepath.lastIndexOf('\\');

        const filename = (filenameStart === -1 ? filepath : filepath.substr(filenameStart + 1));

        this.setState({             
            filename: filename
        });        
    }

    openUpload = () => {
        this.filepathInput.click();
    }

    upload = () => {
        this.props.onClose();        

        const formData = new FormData();
        formData.append('file', this.state.file);

        this.props.onUpload(formData)
    }

    handleFile = (e) => {
        const file = e.target.files[0];
        this.setState({ file: file});
        this.setFilepath(file.name);
    }
    
    render() {
      if (!this.props.isVisible) return null;

        return(     
            <div className="overlay">
                <div className="popup">
                    <div className="content">
                        <a className="close" onClick={this.props.onClose} href="#close-uploadpopup">&times;</a>
                        <p>Choose a file to upload</p>
                        <input id="path" type="file" ref={(input) => this.filepathInput = input} onChange={this.handleFile} />
                        <label className="filename">{this.state.filename}</label>
                        <a className="examine" href="#examine" onClick={this.openUpload} >Examine</a>
                        <a className="accept" onClick={this.upload} href="#accept-file">Accept</a> 
                    </div>
                </div>
            </div>
        )
    }
}
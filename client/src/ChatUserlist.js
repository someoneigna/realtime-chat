import React from 'react';
import './ChatUserlistStyle.css';

export default class ChatUserlist extends React.Component {
    renderUsers = () => {
        return this.props.users.map((u, i) => <li key={i}>{u}</li>)
    }

    render() {
        return(
            <div className="chatUserlist">
                <h2 className="chatUserlist__title">Users</h2>
                <ul className="chatUserlist__content">
                    { this.renderUsers() }
                </ul>
            </div>
        );
    }
}
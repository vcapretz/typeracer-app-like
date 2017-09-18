import * as React from 'react';
import * as queryString from 'query-string';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as api from '../utils/api';

class TypeRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            username: '',
            roomInfo: null,
            loading: true,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        api.waitNewUsers(roomInfo => this.setState({ roomInfo }));
        api.gameStatus(roomInfo => this.setState({ roomInfo }));
    }

    componentDidMount() {
        const info = queryString.parse(this.props.location.search);

        api.joinRoom(info.roomname, info.username)
            .then((data) => {
                this.setState(() => ({
                    error: null,
                    username: info.username,
                    roomInfo: data,
                    loading: false,
                }));
            })
            .catch(() => {
                this.setState(() => ({
                    error: 'Try other username in this room',
                    username: '',
                    roomInfo: null,
                    loading: false,
                }));
            });
    }

    handleClick() {
        api.startCounter(this.state.roomInfo.roomname)
            .then((roomInfo) => {
                this.setState({ roomInfo });
            });
    }

    handleChange() {
        api.default.emit('user typing', {
            text: document.querySelector('textarea').value,
            username: this.state.username,
        });
    }

    render() {
        const { loading, error } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return (
                <div>
                    <p>{error}</p>
                    <Link className="button" to="/battle">Reset</Link>
                </div>
            );
        }

        const { roomInfo } = this.state;

        return (
            <div className="container">
                <small>
                    Wait for at least two users in room and start typing the following text
                </small>
                <div className="row">
                    <div className="column">
                        <strong>Users:</strong>
                        <ul>
                            {roomInfo.users.map(user => (
                                <li key={user.username}>{user.username}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="column">
                        {roomInfo.text}
                    </div>
                    <div className="column">
                        <textarea
                            onChange={this.handleChange}
                            rows="10"
                            style={{ width: '90%' }}
                            disabled={roomInfo.started_at == null ? 'disabled' : ''}
                        />
                    </div>
                </div>
                <button
                    className="button"
                    hidden={roomInfo.started_at != null}
                    disabled={roomInfo.users.length < 2}
                    onClick={this.handleClick}
                >
                    Start!
                </button>
            </div>
        );
    }
}

TypeRoom.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string,
    }),
};

export default TypeRoom;

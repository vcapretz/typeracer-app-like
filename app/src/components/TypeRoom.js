import * as React from 'react';
import * as queryString from 'query-string';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as api from '../utils/api';
import Loading from './commom/Loading';

class TypeRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            username: '',
            roomInfo: null,
            loading: true,
            status: {
                active_users: 0,
                keystrokes: 0,
                active_since: 0,
                below_mean: 0,
                ranking: [],
                last_minute_lead: '',
            },
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);

        window.addEventListener('keydown', (e) => { // block ctrl + c and ctrl + v
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
                e.preventDefault();
                return false;
            }

            return true;
        });

        api.waitNewUsers(roomInfo => this
            .setState(prevState => Object.assign(prevState, { roomInfo })));
        api.gameStatus(roomInfo => this
            .setState(prevState => Object.assign(prevState, { roomInfo })));
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
                    status: {
                        active_users: 0,
                        keystrokes: 0,
                        active_since: 0,
                        below_mean: 0,
                        ranking: [],
                        last_minute_lead: '',
                    },
                }));
            })
            .catch(() => {
                this.setState(() => ({
                    error: 'Try other username in this room',
                    username: '',
                    roomInfo: null,
                    loading: false,
                    status: {
                        active_users: 0,
                        keystrokes: 0,
                        active_since: 0,
                        below_mean: 0,
                        ranking: [],
                        last_minute_lead: '',
                    },
                }));
            });

        api.refreshStatus(info.roomname)
            .then((status) => {
                this.setState({ status });
            });
    }

    handleClick() {
        api.startCounter(this.state.roomInfo.roomname)
            .then((roomInfo) => {
                this.setState({ roomInfo });
            });
    }

    handleChange(e) {
        const textValue = document.getElementById('typingArea').value;

        api.default.emit('user typing', {
            key: e.key,
            index: textValue.length,
            roomname: this.state.roomInfo.roomname,
            username: this.state.username,
        });

        api.refreshStatus(this.state.roomInfo.roomname)
            .then((status) => {
                this.setState({ status });
            });
    }

    renderStatusComponent() {
        return (
            <div>
                <div className="column">
                    <strong>Status:</strong>
                    <ul className="status">
                        <li>Users in room: {this.state.status.active_users}</li>
                        <li>Keys typed: {this.state.status.keystrokes}</li>
                        <li>Below mean: {this.state.status.below_mean}</li>
                        <li>Last minute lead: {this.state.status.last_minute_lead}</li>
                    </ul>
                </div>
                <div className="column">
                    <strong>Ranking:</strong>
                    <ul className="status">
                        {this.state.status.ranking.map(user => (
                            <li key={user[0]}>{user[0]} - {user[1]}</li>
                        ))}
                    </ul>
                </div>
                <button
                    className="button"
                    onClick={this.handleRefresh}
                >
                    Refresh
                </button>
            </div>
        );
    }

    render() {
        const { loading, error } = this.state;

        if (loading) {
            return <Loading />;
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
                        {this.renderStatusComponent()}
                    </div>
                    <div className="column">
                        {roomInfo.text}
                    </div>
                    <div className="column">
                        <textarea
                            id="typingArea"
                            onKeyDown={this.handleChange}
                            rows="10"
                            style={{ width: '90%' }}
                            disabled={roomInfo.started_at == null ? 'disabled' : ''}
                        />
                    </div>
                </div>
                {roomInfo.started_at == null &&
                    <button
                        className="button"
                        disabled={roomInfo.users.length < 2 || roomInfo.started_at != null}
                        onClick={this.handleClick}
                    >
                        Start!
                    </button>
                }
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

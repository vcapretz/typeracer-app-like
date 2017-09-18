import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class Battle extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            roomname: '',
            roomInfo: {},
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeRoomname = this.handleChangeRoomname.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
    }

    handleChangeUsername(event) {
        const { value } = event.target;

        this.setState(() => ({ username: value }));
    }

    handleChangeRoomname(event) {
        const { value } = event.target;

        this.setState(() => ({ roomname: value }));
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.context.router.history.push(`/battle/type?username=${this.state.username}&roomname=${this.state.roomname}`);
    }

    render() {
        const { roomInfo } = this.state;

        if (roomInfo.roomname) {
            return <p> Render Component to await for at least two players to start typing </p>;
        }

        return (
            <div>
                <div className="row">
                    <form className="column" onSubmit={this.handleSubmit}>
                        <label className="header" htmlFor="roomname">{'What room you want to join?'}
                            <input
                                id="roomname"
                                placeholder="Room name"
                                type="text"
                                autoComplete="off"
                                value={this.state.roomname}
                                onChange={this.handleChangeRoomname}
                            />
                        </label>
                        <label className="header" htmlFor="username"> {'What\'s your username?'}
                            <input
                                id="username"
                                placeholder="Username"
                                type="text"
                                autoComplete="off"
                                value={this.state.username}
                                onChange={this.handleChangeUsername}
                            />
                        </label>

                        <button
                            className="button"
                            type="submit"
                            disabled={!this.state.username && this.state.roomname}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

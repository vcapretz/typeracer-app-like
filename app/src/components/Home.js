import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
    render() {
        return (
            <div className="home-container">
                <h1>Type as fast as you can!</h1>

                <Link className="button" to="/battle">Battle</Link>
            </div>
        );
    }
}

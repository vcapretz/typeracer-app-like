import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default function () {
    return (
        <ul className="nav">
            <li>
                <NavLink exact activeClassName="active" to="/">Home</NavLink>
            </li>
            <li>
                <NavLink exact activeClassName="active" to="/battle">Battle</NavLink>
            </li>
        </ul>
    );
}

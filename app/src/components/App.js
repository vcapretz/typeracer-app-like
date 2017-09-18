import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

import Nav from './Nav';
import Home from './Home';
import Battle from './Battle';
import TypeRoom from './TypeRoom';

const { BrowserRouter: Router, Route, Switch } = ReactRouter;

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="container">
                    <Nav />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/battle" component={Battle} />
                        <Route path="/battle/type" component={TypeRoom} />

                        <Route render={() => <p>Not Found</p>} />
                    </Switch>

                </div>
            </Router>
        );
    }
}

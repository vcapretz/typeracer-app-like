import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'babel-polyfill';

import App from './components/App';

require('./assets/stylesheets/index.css');
require('./utils/api');

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);

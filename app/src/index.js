import 'babel-polyfill';

import App from './components/App';

const React = require('react');
const ReactDOM = require('react-dom');

require('./index.css');
require('./utils/api');

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);

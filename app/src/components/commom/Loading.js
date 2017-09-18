import * as React from 'react';
import * as PropTypes from 'prop-types';

class Loading extends React.Component {
    render() {
        return <p style={this.props.styles}>{this.props.text}</p>;
    }
}

Loading.defaultProps = {
    text: 'Loading...',
    styles: { color: 'red' },
};

Loading.propTypes = {
    text: PropTypes.string,
    styles: PropTypes.shape({
        color: PropTypes.string,
    }),
};

export default Loading;

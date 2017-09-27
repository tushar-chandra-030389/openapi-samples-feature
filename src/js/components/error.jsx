import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Panel} from 'react-bootstrap';

class Error extends React.PureComponent {
    componentWillMount() {
        this.props.hideError();
    }

    render() {
        const errorClass = classNames({'hide': !this.props.showError});
        return (
            <Panel header='Alert' bsStyle="danger" className={errorClass}>{this.props.children}</Panel>
        );
    }
}

Error.propTypes = {
    showError: PropTypes.bool
}

export default Error;

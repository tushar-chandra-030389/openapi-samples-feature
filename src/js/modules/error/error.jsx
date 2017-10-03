import React from 'react';
import classNames from 'classnames';
import { bool, func } from 'prop-types';
import { Panel } from 'react-bootstrap';

class Error extends React.PureComponent {
    constructor(props) {
        super(props);
        props.hideError();
    }

    render() {
        const errorClass = classNames({ 'hide': !this.props.showError });
        return (
            <Panel header="Alert" bsStyle="danger" className={errorClass}>{this.props.children}</Panel>
        );
    }
}

Error.propTypes = {
    showError: bool,
    hideError: func.isRequired,
};

Error.defaultProps = { showError: false };

export default Error;

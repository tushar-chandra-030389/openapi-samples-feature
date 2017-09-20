import React from 'react';
import classNames from 'classnames';
import { Panel } from 'react-bootstrap';

function Error({ children, showError }) {
    const errorClass = classNames({ 'hide': !showError });
    return (
        <Panel header='Alert' bsStyle="danger" className={errorClass}>{children}</Panel>
    );
}

export default Error;

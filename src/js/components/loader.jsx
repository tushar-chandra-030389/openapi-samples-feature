import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import defaultImg from '../../images/default.gif';

function Loader({isLoading}) {
    const loaderClass = classNames({'loader': true, 'hide': !isLoading})
    return (
        <div className={loaderClass}>
            <img src={defaultImg}/>
        </div>
    );
}

Loader.propTypes = {
    isLoading: PropTypes.bool
}

export default Loader;

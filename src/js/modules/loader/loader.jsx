import React from 'react';
import classNames from 'classnames';
import { bool } from 'prop-types';
import defaultImg from 'assets/images/default.gif';

class Loader extends React.PureComponent {
    render() {
        const loaderClass = classNames({ 'loader': true, 'hide': !this.props.isLoading });
        return (
            <div className={loaderClass}>
                <img src={defaultImg}/>
            </div>
        );
    }
}

Loader.propTypes = { isLoading: bool };

Loader.defaultProps = { isLoading: false };

export default Loader;

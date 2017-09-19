import React from 'react';
import classNames from 'classnames';

function Loader({ isLoading }) {
    const loaderClass = classNames({ 'loader': true, 'hide': !isLoading })
    return (
        <div className={loaderClass}>
			<img src="images/default.gif"/>
		</div>
    );
}

export default Loader;

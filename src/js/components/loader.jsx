import React from 'react';
import classNames from 'classnames';
import defaultImg from '../../images/default.gif';

function Loader({ isLoading }) {
    const loaderClass = classNames({ 'loader': true, 'hide': !isLoading })
    return (
        <div className={loaderClass}>
			<img src={defaultImg}/>
		</div>
    );
}

export default Loader;

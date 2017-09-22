import React from 'react';
import * as pageDescMapper from '../data/pageDescMapper';
import PropTypes from 'prop-types';

const DetailsHeader = ({route}) => {
    route = route.slice(1, route.length);
    return (
        <div>
            <div className='details-header'>
                <div className='details-title'>
                    {pageDescMapper[route].title}
                </div>
            </div>
            <div className='details-banner'>
                {pageDescMapper[route].desc}
            </div>
        </div>
    );
};

DetailsHeader.propTypes = {
    route: PropTypes.string,
}

export default DetailsHeader;

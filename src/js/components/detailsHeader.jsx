import React from 'react';
import * as pageDescMapper from '../data/pageDescMapper';

function DetailsHeader({ route }) {
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
}

export default DetailsHeader;

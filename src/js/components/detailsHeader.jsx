import React from 'react';
import * as pageDescMapper from '../data/pageDescMapper.json';
import PropTypes from 'prop-types';

function DetailsHeader({ route }) {

    // this function takes out title from the route param and loads appropriate header
    // from pageDescMapper json file
    const routeParm = route.slice(1, route.length);
    return (
        <div>
            <div className="details-header">
                <div className="details-title">
                    {pageDescMapper[routeParm].title}
                </div>
            </div>
            <div className="details-banner">
                {pageDescMapper[routeParm].desc}
            </div>
        </div>
    );
}

DetailsHeader.propTypes = {
    route: PropTypes.string,
};

export default DetailsHeader;

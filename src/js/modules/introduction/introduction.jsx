import React from 'react';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DetailsHeader from '../../components/detailsHeader';

function Introduction(props) {
    return (
        <div>
            <DetailsHeader route={props.match.url}/>
            <div className='pad-box'>
                <h2>
                    <small>
                        This application contains a number of samples to illustrate how to use the different resources
                        and endpoints available in the Saxo Bank OpenAPI.
                        All samples require a valid access token, which you may obtain from the developer portal
                    </small>
                </    h2>
                <Alert bsStyle='warning'>
                    Some responses may return no samples, depending upon actual market data entitlements and the
                    configuration of the logged in user.
                </Alert>
            </div>
        </div>
    );
}

Introduction.propTypes = {
    match: PropTypes.object
}

export default Introduction;

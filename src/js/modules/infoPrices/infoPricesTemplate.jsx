import React from 'react';
import { ButtonToolbar, Button, Panel } from 'react-bootstrap';
import { object, bool, func } from 'prop-types';
import CustomTable from 'src/js/components/customTable';

function InfoPricesTemplate(props) {
    return (
        <div>
            {
                props.instruments && (
                    <Panel bsStyle="primary" >
                        <ButtonToolbar>
                            <Button
                                bsStyle="primary"
                                onClick={props.onSubscribeClick}
                                disabled={props.hasSubscription}
                            >
                                Subscribe
                            </Button>
                            <Button
                                bsStyle="primary"
                                onClick={props.onUnsubscribeClick}
                                disabled={!props.hasSubscription}
                            >
                                UnSubscribe
                            </Button>
                            <Button
                                bsStyle="primary"
                                onClick={props.onGetInfoPricesClick}
                                disabled={props.hasSubscription}
                            >
                                Get Prices
                            </Button>
                        </ButtonToolbar>
                        <CustomTable
                            data={props.instruments}
                            keyField="Uic"
                            dataSortFields={['Uic', 'AssetType']}
                            width={'250'}
                            showUpdateAnim={true}
                            hidden={['DisplayAndFormat.Decimals', 'DisplayAndFormat.Format', 'DisplayAndFormat.OrderDecimals']}
                            formatter={'DisplayAndFormat.Decimals'}
                            priceFields={[
                                'Quote.Ask',
                                'Quote.Bid',
                                'Quote.Mid',
                                'PriceInfoDetails.LastClose',
                                'PriceInfoDetails.LastTraded',
                                'PriceInfo.High',
                                'PriceInfo.Low',
                            ]}
                        />
                    </Panel>)
            }
        </div>
    );
}

InfoPricesTemplate.propTypes = {
    instruments: object,
    hasSubscription: bool,
    onSubscribeClick: func.isRequired,
    onUnsubscribeClick: func.isRequired,
    onGetInfoPricesClick: func.isRequired,
};

InfoPricesTemplate.defaultProps = {
    instruments: {},
    hasSubscription: false,
};

export default InfoPricesTemplate;

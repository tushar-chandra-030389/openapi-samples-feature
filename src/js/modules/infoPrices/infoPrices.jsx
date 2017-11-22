import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { object } from 'prop-types';
import _ from 'lodash';

import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';
import Assets from 'src/js/modules/assets';
import InfoPricesTemplate from './infoPricesTemplate';
import * as queries from './queries';
import { checkIfPutCallExpiry } from 'src/js/utils/global';

class InfoPrices extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { flag: false };
        this.selectedInstruments = {};
        this.selectedAssetTypes = {};
    }

    componentWillUnmount() {

        // subscription needs to be destroyed on navigating to other pages
        queries.removeSubscription(this.selectedAssetTypes, this.props, (assetType) => {
            this.selectedAssetTypes[assetType].subscription = null;
        });
    }

    handleInstrumentSelected(instrument) {
        this.handleUnsubscribe();
        queries.fetchInfoPrices(instrument, this.props, (response) => {

            const { AssetType, Uic } = response;

            // this is for fxvanilla, fxnotouch, fxonetouch
            if (checkIfPutCallExpiry(AssetType)) {
                response.ExpiryDate = instrument.Expiry;
                response.PutCall = instrument.PutCall;
            }
            this.selectedAssetTypes[AssetType] = { subscription: null };
            this.selectedInstruments[Uic] = response;

            this.setState({ flag: !this.state.flag });
        });
    }

    handleSubscribe() {
        queries.createSubscription(
            this.selectedAssetTypes,
            this.selectedInstruments,
            this.props,
            this.onPriceUpdate.bind(this),
            (response, assetType) => {
                this.selectedAssetTypes[assetType].subscription = response;
                this.setState({ flag: !this.state.flag });
            }
        );
    }

    handleUnsubscribe() {
        queries.removeSubscription(this.selectedAssetTypes, this.props, (assetType) => {
            this.selectedAssetTypes[assetType].subscription = null;
            this.setState({ flag: !this.state.flag });
        });
    }

    handleGetInfoPrices() {
        queries.fetchInfoPriceList(this.selectedAssetTypes, this.selectedInstruments, this.props, (result) => {
            this.onPriceUpdate(result);
        });
    }

    onPriceUpdate(update) {
        const instrumentData = update.Data;
        _.forEach(instrumentData, (value) => {
            _.merge(this.selectedInstruments[value.Uic], value);
        });
        this.setState({ flag: !this.state.flag });
    }

    hasSubscription() {
        return queries.isSubscribed(this.selectedAssetTypes);
    }

    hasInsruments() {
        return !(_.isEmpty(this.selectedInstruments));
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box" >
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <Assets showOptionsTemplate onInstrumentSelected={this.handleInstrumentSelected} {...this.props}/>
                    {
                        this.hasInsruments() &&
                        <InfoPricesTemplate
                            instruments={this.selectedInstruments}
                            onSubscribeClick={this.handleSubscribe}
                            onUnsubscribeClick={this.handleUnsubscribe}
                            onGetInfoPricesClick={this.handleGetInfoPrices}
                            hasSubscription={this.hasSubscription()}
                        />
                    }
                </div>
            </div>
        );
    }
}

InfoPrices.propTypes = { match: object };

InfoPrices.defaultProps = { match: {} };

export default bindHandlers(InfoPrices);

import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import DetailsHeader from '../../components/detailsHeader';
import Error from '../error';
import * as queries from './queries';

class InfoPrices extends React.Component {
    constructor(props) {
        super(props);
        this.state = { flag: false };
        this.selectedInstruments = {};
        this.selectedAssetTypes = {};
    }

    handleInstrumentSelected(instrument) {
        queries.fetchInfoPrices(instrument, props, (response) => {
            // reset selectedAssetTypes and selectedInstruments, then set it to assetType of data
            this.selectedAssetTypes = {};
            this.selectedInstruments = {};
            this.selectedAssetTypes[response.AssetType] = { subscription: undefined };
            this.selectedInstruments[response.Uic] = response;
            this.setState({ flag: !this.state.flag });
        });
    }

    handleSubscribe() {
        queries.createSubscription(this.selectedAssetTypes, this.selectedInstruments, this.props, onPriceUpdate, (response, assetType) => {
            this.selectedAssetTypes[assetType].subscription = response;
        });
    }

    handleUnsubscribe() {
        queries.removeSubscription(this.selectedAssetTypes, this.props, () => {
            this.setState({ flag: !this.state.flag });
        });
    }

    handleGetInfoPrices() {
        queries.fetchInfoPriceList(this.selectedAssetTypes, props, onPriceUpdate);
    }

    onPriceUpdate(update) {
        const instrumentData = update.Data;
        for(let index in instrumentData) {
            _.merge(this.selectedInstruments[instrumentData[index].Uic], instrumentData[index]);
        }
        this.setState({ flag: !this.state.flag });
    }

    hasSubscription() {
        return queries.isSubscribed(this.selectedAssetTypes);
    }

    hasInsruments() {
        return _.isEmpty(this.selectedInstruments); 
    }

    render() {
        <div>
            <DetailsHeader route={this.props.match.url}/>
            <div className='pad-box' >
                <Error>
                    Enter correct access token using
                    <a href='#/userInfo'> this link.</a>
                </Error>
                <Assets onInstrumentSelected={this.handleInstrumentSelected} {...this.props}/>
                {/*{
                    this.hasInsruments() && 
                    <InfoPricesTemplate
                        instruments={this.selectedInstruments}
                        onSubscribeClick={this.handleSubscribe}
                        onUnsubscribeClick={this.handleUnsubscribe}
                        onGetInfoPricesClick={this.handleGetInfoPrices}
                        hasSubscription={this.hasSubscription()} 
                    />
                }*/}
            </div>
        </div>
    }
}

export default bindHandlers(InfoPrices);

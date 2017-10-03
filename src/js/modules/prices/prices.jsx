import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { object } from 'prop-types';
import _ from 'lodash';
import { Col } from 'react-bootstrap';
import PricesTemplate from './pricesTemplate';
import Error from '../error';
import DetailsHeader from '../../components/detailsHeader';
import Assets from '../assets';
import { removeSubscription, createSubscription } from './queries';

class Prices extends React.PureComponent {
    constructor() {
        super();
        this.instrument = undefined;
        this.subscription = undefined;
        this.state = { instrumentSelected: false };
    }

    componentWillUnmount() {
        this.handleUnsubscribe();
    }

    handleInstrumentSelected(instrument) {
        this.handleUnsubscribe();
        this.handleSubscribe(instrument);
    }

    handleSubscribe(instrument) {
        createSubscription(instrument, this.props, this.onPriceUpdate.bind(this), (subscription) => {
            this.subscription = subscription;
        });
    }

    handleUnsubscribe() {
        removeSubscription(this.subscription, this.props, () => {
            this.subscription = undefined;
        });
    }

    onPriceUpdate(data) {
        if (data.Data) {
            this.instrument = _.defaults(data.Data, this.instrument);

            // _.merge(this.instrument, data.Data);
        } else {
            this.instrument = _.defaults(data, this.instrument);

            // _.merge(this.instrument, data);
        }
        this.setState({ instrumentSelected: !this.state.instrumentSelected });
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url} />
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <Col sm={8}>
                        <Assets showOptionsTemplate {...this.props} onInstrumentSelected={this.handleInstrumentSelected}/>
                        <PricesTemplate instrumentPrices={this.instrument}/>
                    </Col>
                </div>
            </div>
        );
    }
}

Prices.propTypes = { match: object };

Prices.defaultProps = { match: {} };

export default bindHandlers(Prices);

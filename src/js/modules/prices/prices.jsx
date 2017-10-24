import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { object } from 'prop-types';
import _ from 'lodash';
import { Col } from 'react-bootstrap';
import PricesTemplate from './pricesTemplate';
import Error from 'src/js/modules/error';
import DetailsHeader from 'src/js/components/detailsHeader';
import Assets from 'src/js/modules/assets';
import { removeSubscription, createSubscription } from './queries';

class Prices extends React.PureComponent {
    constructor() {
        super();
        this.instrument = null;
        this.subscription = null;
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
            this.subscription = null;
        });
    }

    onPriceUpdate(data) {
        if (data.Data) {
            this.instrument = _.defaultsDeep(data.Data, this.instrument);
        } else {
            this.instrument = _.defaultsDeep(data, this.instrument);
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
                        <a href="/userInfo"> this link.</a>
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

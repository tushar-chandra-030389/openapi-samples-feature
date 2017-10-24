import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TradeSubscriptions from 'src/js/modules/tradeSubscription';
import { object } from 'prop-types';

class OrdersNPositionsTab extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: props.selectedAccount,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selectedAccount: nextProps.selectedAccount });
    }

    render() {
        return (
            <Tabs className="primary" defaultActiveKey={1} animation={false} id="noanim-tab-example">

                {/* orders tab*/}
                <Tab eventKey={1} title="Orders">
                    {this.state.selectedAccount &&
                    <TradeSubscriptions
                        {...this.props}
                        currentAccountInformation={this.state.selectedAccount}
                        tradeType="Order"
                        fieldGroups={['DisplayAndFormat', 'ExchangeInfo']}
                    />
                    }
                </Tab>

                {/* positions tab*/}
                <Tab eventKey={2} title="Positions">
                    {this.state.selectedAccount &&
                    <TradeSubscriptions
                        {...this.props}
                        currentAccountInformation={this.state.selectedAccount}
                        tradeType="NetPosition"
                        fieldGroups={['NetPositionView',
                            'NetPositionBase',
                            'DisplayAndFormat',
                            'ExchangeInfo',
                            'SingleAndClosedPositionsBase',
                            'SingleAndClosedPositionsView',
                            'SingleAndClosedPositions']}
                    />
                    }
                </Tab>
            </Tabs>
        );
    }
}

OrdersNPositionsTab.propTypes = {
    selectedAccount: object,
};

export default OrdersNPositionsTab;

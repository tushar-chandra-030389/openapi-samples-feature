import _ from 'lodash';

export function checkIfOption(asset) {
    const options = ['StockOption', 'StockIndexOption', 'FuturesOption'];
    const index = _.findIndex(options, (elm) => (elm === asset));
    return (index !== -1);
}

export function checkIfPutCallExpiry(asset) {
    return (asset === 'FxVanillaOption');
}
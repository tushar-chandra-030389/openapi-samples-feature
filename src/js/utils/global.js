import _ from 'lodash';

export function checkIfOption(asset) {
    const options = ['StockOption', 'StockIndexOption', 'FuturesOption'];
    const index = _.findIndex(options, (elm) => (elm === asset));
    return (index !== -1);
}

export function checkIfPutCallExpiry(asset) {
    return (asset === 'FxVanillaOption');
}

export function doWithLoader(props, apiFunc, callback) {
    props.showLoader();
    props.hideError();
    apiFunc()
        .then((result) => {
            if (callback) {
                callback(result);
            }

        })
        .catch(() => props.showError())
        .then(() => props.hideLoader());
}

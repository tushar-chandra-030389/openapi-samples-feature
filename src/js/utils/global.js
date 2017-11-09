import _ from 'lodash';

/* this function check if the selected asset is an option or not
    @return true/false
*/
export function checkIfOption(asset) {
    const options = ['StockOption', 'StockIndexOption', 'FuturesOption'];
    const index = _.findIndex(options, (elm) => (elm === asset));
    return (index !== -1);
}

/* this function check if the expiry is required for the selected asset
    @return true/false
*/
export function checkIfPutCallExpiry(asset) {
    const options = ['FxVanillaOption', 'FxNoTouchOption', 'FxOneTouchOption'];
    const index = _.findIndex(options, (elm) => (elm === asset));
    return (index !== -1);
}

/* any async call can be made using this function and the loader toggle and network error handling
    will be taken care automatically.
    @parameter 1: props from react component
    @parameter 2: async function to be called
    @parameter 1: callback fxn
*/
export function doWithLoader(props, apiFunc, callback) {
    props.showLoader();
    props.hideError();

    if (props.accessToken) {
        apiFunc()
            .then((result) => {
                if (callback) {
                    callback(result);
                }
            },
            (error) => {
                setGlobalErrMessage(props, error);
            })
            .catch(() => props.showError())
            .then(() => props.hideLoader());

    } else {
        props.showError();
        props.hideLoader();
    }
}

export function doWithLoaderAll(props, apiFunc, onSuccessApiFunc, callback, nextCallback) {
    props.showLoader();
    props.hideError();
    if (props.accessToken) {
        apiFunc()
            .then((result) => {
                const intermediate = result;
                return Promise.all([onSuccessApiFunc(), intermediate]);
            }, (error) => {
                const { ErrorInfo, Message } = error.response;
                if (ErrorInfo) {
                    props.setErrMessage(ErrorInfo.Message);
                } else if (Message) {
                    props.setErrMessage(Message);
                }
            }).then(([result, intermediate]) => {
                if (callback) {
                    callback(intermediate);
                }
                if (nextCallback) {
                    nextCallback(result);
                }
            }, (error) => {
                const { ErrorInfo, Message } = error.response;
                if (ErrorInfo) {
                    props.setErrMessage(ErrorInfo.Message);
                } else if (Message) {
                    props.setErrMessage(Message);
                }
            }).catch(() => props.showError())
            .then(() => props.hideLoader());
    } else {
        props.showError();
        props.hideLoader();
    }
}

export function setGlobalErrMessage(props, error) {
    const { ErrorInfo, Message } = error.response;
    if (ErrorInfo) {
        props.setErrMessage(ErrorInfo.Message);
    } else if (Message) {
        props.setErrMessage(Message);
    } else {
        props.setErrMessage('Some error has occured.');
    }
}

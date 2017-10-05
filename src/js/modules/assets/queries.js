import _ from 'lodash';
import { doWithLoader } from 'src/js/utils/global';
import { getInstruments, getInstrumentDetails, getOptionChain } from 'src/js/utils/api';

export function fetchInstruments(eventKey, props, cb) {
    doWithLoader(props, _.partial(getInstruments, props.accessToken, eventKey), (result) => cb(result.response));
}

export function fetchInstrumentDetails(instrument, props, cb) {
    doWithLoader(
        props,
        _.partial(getInstrumentDetails, props.accessToken, instrument.Identifier, instrument.AssetType),
        (result) => cb(result.response)
    );
}

export function fetchOptionChain(selectedOptionRoot, props, cb) {
    doWithLoader(
        props,
        _.partial(getOptionChain, props.accessToken, selectedOptionRoot.Identifier),
        (result) => cb(result.response)
    );
}

export function getFormattedExpiry(dateStr) {
    // format date strinf to YYYY-MM-DD format.
    const date = new Date(dateStr);
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
}

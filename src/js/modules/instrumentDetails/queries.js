import _ from 'lodash';

import { fetchInfo } from 'src/js/utils/queries';

export function getRearrangedDetails(instrumentDetails) {
    return _.defaults({
        'Uic': instrumentDetails.Uic,
    }, {
        'Symbol': instrumentDetails.Symbol,
    },
    instrumentDetails
    );
}

export function getSymbolForID(instrumentDetails, cb, props) {
    const idArrayForWhichSymbolRequired = ['RelatedOptionRoots'];
    _.forOwn(instrumentDetails, (value, key) => {
        // get symbol for the IDs in array 'idArrayforWhichSymbolRequired'
        if (_.some(idArrayForWhichSymbolRequired, (field) => field === key)) {
            if (_.isArray(value)) {
                _.forEach(value, (val, index) => {
                    fetchInfo('getOptionChain', props, val, (result) => {
                        cb(result, key, index);
                    });
                });
            } else {
                fetchInfo('getOptionChain', props, value, (result) => {
                    cb(result, key, null);
                });
            }
        }
    });
}

export function getRenderDetails(instrumentDetails) {

    const instData = _.reduce(instrumentDetails, (result, value, key) => {

        // 'TickSizeScheme gives [Object object] error on ui, that's why it is removed.
        if (key !== 'TickSizeScheme') {
            result.push({
                FieldName: key,
                Value: value,
            });
        }
        return result;
    }, []);
    return instData;
}

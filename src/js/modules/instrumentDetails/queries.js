import _ from 'lodash';
import { getOptionRootData } from '../../utils/api';
import { doWithLoader } from '../../utils/global';

export function getRearrangedDetails(instrumentDetails) {
    return _.defaults({
            'Uic': instrumentDetails.Uic
        }, {
            'Symbol': instrumentDetails.Symbol
        },
        instrumentDetails
    );
}

export function getSymbolForID(instrumentDetails, cb, props) {
    const idArrayForWhichSymbolRequired = ['RelatedOptionRoots'];
    _.forOwn(instrumentDetails, (value, key) => {
        //get symbol for the IDs in array 'idArrayforWhichSymbolRequired'
        if ((_.findIndex(idArrayForWhichSymbolRequired, field => field === key) !== -1)) {
            if (_.isArray(value)) {
                _.forEach(value, (val, index) => {
                    _fetchOptionRootData(props, key, value, index, cb);
                })
            } else {
                _fetchOptionRootData(props, key, value, null);
            }
        }
    });
}

export function getRenderDetails(instrumentDetails) {
    let instData = []
    for (let name in instrumentDetails) {
        instData.push({
            FieldName: name,
            Value: instrumentDetails[name]
        });
    }
    return instData;
}

function _fetchOptionRootData(props, key, value, index, cb) {
    doWithLoader(props, _.partial(getOptionRootData, props.accessToken, value), (result) => {
        cb(result.response, key, index);
    });
}

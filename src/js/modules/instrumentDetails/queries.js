import _ from 'lodash';
import { getOptionRootData } from '../../utils/api';

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
    let updatedDetails;
    _.forOwn(instrumentDetails, (value, key) => {
        //get symbol for the IDs in array 'idArrayforWhichSymbolRequired'
        if ((_.findIndex(idArrayForWhichSymbolRequired, field => field === key) !== -1)) {
            if (_.isArray(value)) {
                _.forEach(value, (val, index) => {
                    _fetchOptionRootData(props, key, value, index);
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

function _fetchOptionRootData(props, key, value, index) {
    props.showLoader();
    props.hideLoader();
    getOptionRootData(props.accessToken, value)
    .then((result) => {
        cb(result.response, key, index)
    })
    .catch(() => props.showError())
    .then(() => props.hideLoader());
}

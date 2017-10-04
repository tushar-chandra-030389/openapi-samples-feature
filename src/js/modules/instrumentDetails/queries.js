import _ from 'lodash';
import { getOptionRootData } from 'src/js/utils/api';
import { doWithLoader } from 'src/js/utils/global';

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
                    fetchOptionRootData(props, key, value, index, cb);
                });
            } else {
                fetchOptionRootData(props, key, value, null, cb);
            }
        }
    });
}

export function getRenderDetails(instrumentDetails) {
    const instData = _.reduce(instrumentDetails, (result, value, key) => {
        result.push({
            FieldName: key,
            Value: value,
        });
        return result;
    }, []);
    return instData;
}

function fetchOptionRootData(props, key, value, index, cb) {
    doWithLoader(props, _.partial(getOptionRootData, props.accessToken, value), (result) => {
        cb(result.response, key, index);
    });
}

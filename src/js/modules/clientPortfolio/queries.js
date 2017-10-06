import { doWithLoader } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function getInfo(fn, props, callBack, params) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

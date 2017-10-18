import { doWithLoader } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function getInfo(fn, props, callBack, param1, param2) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, param1, param2), (result) => {
        callBack(result.response);
    });
}

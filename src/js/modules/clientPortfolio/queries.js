import { doWithLoader } from '../../utils/global';
import * as API from '../../utils/api';

export function getInfo( fn, props , callBack, params ) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

import { doWithLoader } from 'src/js/utils/global';
import { getChartData } from 'src/js/utils/api';
import _ from 'lodash';

export function fetchChartData(props, callBack, params) {
    doWithLoader(props, _.partial(getChartData, props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

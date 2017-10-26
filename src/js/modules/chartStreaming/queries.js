import { doWithLoader } from 'src/js/utils/global';
import { subscribeChartStreamingData, removeIndividualSubscription } from 'src/js/utils/api';
import _ from 'lodash';

export function subscribeChartData(params, props, onUpdate, cb) {
    doWithLoader(props, _.partial(subscribeChartStreamingData, props.accessToken, params, onUpdate), (result) => {
        cb(result);
    });
}

export function unsubscribeChartData(props, subscription) {
    doWithLoader(props, _.partial(removeIndividualSubscription, props.accessToken, subscription));
}

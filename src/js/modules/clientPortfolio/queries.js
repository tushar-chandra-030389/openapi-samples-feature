import { doWithLoader } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function getInfo(fn, props, callBack, params) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

export function getBalanceInfoObjectFromResponse(response) {
    const {
        CashBalance,
        TransactionsNotBooked,
        NonMarginPositionsValue,
        UnrealizedMarginProfitLoss,
        CostToClosePositions,
        OptionPremiumsMarketValue,
        TotalValue,
        MarginCollateralNotAvailable,
        MarginUsedByCurrentPositions,
        MarginAvailableForTrading,
        MarginUtilizationPct,
        MarginNetExposure,
        MarginExposureCoveragePct,
    } = response;

    const balancesInfo = {
        'Cash balance': CashBalance,
        'Transactions not booked': TransactionsNotBooked,
        'Value of stocks, ETFs, bounds': NonMarginPositionsValue,
        'P/L of margin positions': UnrealizedMarginProfitLoss,
        'Cost to close': CostToClosePositions,
        'Value of positions': NonMarginPositionsValue + UnrealizedMarginProfitLoss + CostToClosePositions + (OptionPremiumsMarketValue || 0),
        'Account value': TotalValue,
        'Not available as margin collateral': MarginCollateralNotAvailable,
        'Reserved for margin positions': MarginUsedByCurrentPositions,
        'Margin available': MarginAvailableForTrading,
        'Margin utilisation': MarginUtilizationPct,
        'Net exposure': MarginNetExposure,
        'Exposure coverage': MarginExposureCoveragePct,
    };

    return balancesInfo;
}

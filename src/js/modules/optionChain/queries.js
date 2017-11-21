import _ from 'lodash';

export function batchExpiries(dataExpiries, createdExpiries) {
    _.forEach(dataExpiries, (value) => {
        const { Strikes } = value;
        if (Strikes) {
            const strikeArr = [];
            _.forEach(Strikes, (val) => {
                if (val.Call) {
                    strikeArr.push(val);
                }
            });

            const expiryDate = new Date(value.Expiry).toString();

            // this is for checking if the record is previously present inside this.expiries
            _.remove(createdExpiries, { expiryDate });

            const obj = {
                expiryDate,
                strikeArr,
            };
            createdExpiries.push(obj);
        }
    });
    return createdExpiries;
}

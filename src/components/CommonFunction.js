import moment from "moment";

const diff = (obj1, obj2) => {
    for (var i in obj2) {
        if (obj1[i] === obj2[i]) {
            delete obj1[i];
        }
    }
    return obj1;
}

const identicalProperty = (obj1, obj2) => {
    let result = {};
    for (var i in obj2) {
        if (obj1.hasOwnProperty(i)) {
            result = { ...result, [i]: obj1[i] }
        }
    }
    return result;
}

const vtObj = (obj) => {
    let result = Array.from(Object.keys(obj), item => ({ 'v': item, 't': obj[item] }))
    return result;
}

const translateOptions = (obj) => {
    let result = Array.from(Object.keys(obj), item => ({ 'label': obj[item], 'value': item }))
    return result;
}

const stringFormat = (string, array) => {
    let result = string;
    if (array && array.length > 0) {
        let insertLength = array.length;
        while (insertLength > 0) {
            insertLength--
            result = result.replace((`{${insertLength}}`), array[insertLength])
        }
    }
    return result;
}

const deleteEmptyProperty = (obj) => {
    let result = obj;
    for (var i in result) {
        if (result[i] === '') {
            delete result[i]
        }
    }
    return result;
}

const commonFilter = (filter, input, formatOrDefaultValue) => {
    let temp = Object.prototype.toString.call(filter).match(/\[object (.*?)\]/)[1].toLowerCase();
    if (temp === 'string') {
        switch (filter) {
            default:
                console.log('filter Error,Please enter the correct format')
                break;
            case 'centToUsd':
                if (!input) {
                    return 0.00;
                } else {
                    return (input / 100).toFixed(2);
                }
            case 'usdToCent':
                let v = parseFloat(input);
                if (isNaN(v)) return 0;
                return parseInt((v * 100).toFixed());
            case 'fDate':
                if (!input) return '';
                return moment.utc(input).format(formatOrDefaultValue ? formatOrDefaultValue : 'YYYY-MM-DD HH:mm')
        }
    } else if (temp === 'object') {
        let result = formatOrDefaultValue ? formatOrDefaultValue : '';
        if (!input && input !== 0) return result;
        return filter[input.toString()] || input
    }
}


export { diff, vtObj, stringFormat, identicalProperty, commonFilter, translateOptions, deleteEmptyProperty };
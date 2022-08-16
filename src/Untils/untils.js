const lang = require('./lang.json');
const country = require('./country.json')
const math = require("mathjs");
//判断两个对象的一些属性是否想同
/**
 * @method isSame
 * @param {Object}initialValues //初始数据
 * @param {Object} data  //新数据
 * @param {Array}attrArr // 比较的属性array
 */
function isSame(initialValues, data, attrArr) {
    let result = true;
    console.log(initialValues,data)
    for (let i = 0; i < attrArr.length; i++) {
        if (data[attrArr[i]] !== initialValues[attrArr[i]]) {
            result = false;
        }
    }
    return result;
}
//货币格式化
/**
 * @method currencyFormat
 * @param number  需要格式化的数字
 * @param places 保留几位小数
 * @param symbol  货币符号
 * @param thousand 隔开符号
 * @param decimal 表示小数点
 */
function currencyFormat(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol || "￥";
    thousand = thousand || ",";

    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "";
    let i = null, j = null;
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, `${symbol}1,`) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "")
}
//根据语言code取语言
/**
 * @method getLanguage
 * @param code 语言code
 * @returns string 
 */
function getLanguage(code) {
    let obj = {};
    for (let key of lang) {
        Reflect.set(obj, key.v, key.t)
    }
    return obj[code] ?? code;
}
//根据语言code取语言
/**
 * @method getCountry
 * @param code 国家code
 * @returns string 
 */
function getCountry(code) {
    let obj = {};
    for (let key of country) {
        Reflect.set(obj, key.v, key.t)
    }
    return obj[code] ?? code;;
}
function add(num1, num2) {
    return math.format(math.add(num1, num2), { precision: 14 })
}
function multiply(num1, num2) {
    return Number(math.format(math.multiply(num1, num2), { precision: 14 }))
}
export {
    isSame,
    currencyFormat,
    getLanguage,
    getCountry,
    add,
    multiply
};
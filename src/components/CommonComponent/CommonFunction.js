import moment from "moment";

const diff = (obj1, obj2) => {
  for (let i in obj2) {
    if (obj1[i] === obj2[i]) {
      delete obj1[i];
    }
  }
  return obj1;
};

const identicalProperty = (obj1, obj2) => {
  let result = {};
  for (let i in obj2) {
    if (obj1.hasOwnProperty(i)) {
      result = { ...result, [i]: obj1[i] };
    }
  }
  return result;
};

const vtObj = (obj) => {
  let result = Array.from(Object.keys(obj), (item) => ({
    v: item,
    t: obj[item],
  }));
  return result;
};
const vtSubAccounts = (subArr) => {
  let result = subArr.map((item) => ({
    v: item.id,
    t: `(${item.id}) ${item.name}`,
  }));
  return result;
};

const translateOptions = (obj) => {
  let result = Array.from(Object.keys(obj), (item) => ({
    label: obj[item],
    value: item,
  }));
  return result;
};
const arrayOptions = (arr) => {
  let result = arr.map((item) => ({
    label: item.t,
    value: item.v,
  }));
  return result;
};

const stringFormat = (string, array) => {
  let result = string;
  if (array && array.length > 0) {
    let insertLength = array.length;
    while (insertLength > 0) {
      insertLength--;
      result = result?.replace(`{${insertLength}}`, array[insertLength]);
    }
  }
  return result;
};

const deleteEmptyProperty = (obj) => {
  let result = obj;
  for (let i in result) {
    if (result[i] === "") {
      delete result[i];
    }
  }
  // console.log('deleteEmptyResult', result)
  return result;
};

const commonFilter = (filter, input, formatOrDefaultValue) => {
  let temp = Object.prototype.toString
    .call(filter)
    .match(/\[object (.*?)\]/)[1]
    .toLowerCase();
  if (temp === "string") {
    switch (filter) {
      default:
        console.log("filter Error,Please enter the correct format");
        break;
      case "centToUsd":
        if (!input) {
          return "0.00";
        } else {
          return (input / 100).toFixed(2);
        }
      case "usdToCent":
        let v = parseFloat(input);
        if (isNaN(v)) return 0;
        return parseInt((v * 100).toFixed());
      case "fDate":
        if (!input) return "";
        return moment
          .utc(input)
          .format(
            formatOrDefaultValue ? formatOrDefaultValue : "YYYY-MM-DD HH:mm"
          );
      case "payType":
        if (!input) return "";
        let tempPayType = JSON.parse(localStorage.getItem("paymentConfig"));
        tempPayType = tempPayType.filter((item) => item.pay_type === input);
        return tempPayType[0]?.name;
      case "purchaseStatus":
        if (!input && input !== 0) return "";
        return (
          {
            0: "Requested",
            1: "Completed",
            2: "Pending",
            3: "Cancelled",
            //4: 'Frozen',
            5: "Failed",
            6: "Refund",
          }[input] || input.toString()
        );
      case "payMethodStatus":
        if (!input && input !== 0) return "";
        return (
          {
            0: "Disabled",
            1: "All Country",
            2: "Specified Countries can use",
            3: "Specified Countries cannot use",
          }[input] || input.toString()
        );
      case "orderTag":
        return (
          {
            0: "Normal",
            1: "Fraudulent",
            2: "Unsatisfied",
            3: "Duplicate",
            4: "Purchase by mistake",
            5: "Requested by customer",
            6: "Internal testing",
            7: "Suspicious Fraud",
            8: "Blackhole - Refund",
          }[input] || input.toString()
        );
      case "withdrawStatus":
        if (!input && input !== 0) return "";
        return (
          {
            0: "(0)Pending Approval",
            1: "(1)Approved; will pay",
            2: "(2)Completed",
            3: "(3)Unapproved",
            4: "(4)ITALKI Canceled",
            5: "(5)Teacher canceled",
            6: "(6)Withdrawal reversed",
            7: "(7)Cash has been paid",
            "-1": "Uploaded file to Hyperwallet",
          }[input.toString()] || input.toString()
        );
      case "withdrawType":
        if (!input && input !== 0) return "";
        return (
          {
            1: "Not immediately",
            2: "Immediately",
          }[input] || input.toString()
        );
      case "sourceType":
        if (!input) return "";
        return (
          {
            1: "Direct Payment",
            4: "By-GiftCard",
            5: "By-Lesson",
            6: "By-Product",
            7: "By-LanguageChallenge",
          }[input.toString()] || "(" + input.toString() + ") Unknown"
        );
      case "transactionShowtype":
        if (!input) return "";
        let tempShowtype = JSON.parse(
          localStorage.getItem("transactionShowtype")
        );
        tempShowtype = tempShowtype.filter(
          (item) => item.type === Number(input)
        );
        return tempShowtype[0]?.name;
      case "payMethodSupplier":
        if (!input) return "";
        let paymentSuppliers = JSON.parse(
          localStorage.getItem("payment_suppliers")
        );
        paymentSuppliers = paymentSuppliers.filter(
          (item) => item.id === Number(input)
        );
        return paymentSuppliers[0]?.pay_supplier_name;
      case "gt":
        if (!input) return "Null";
        if (input) {
          input = input.toString().trim();
        }
        const r = getLanguageCountry()[input];
        if (r) {
          return r;
        }
        return input;
      case "costCenterCategory":
        if (!input) return "";
        const costCenter = JSON.parse(localStorage.getItem("costCenters"));
        return costCenter.find((item) => item.code === input)["category"];
    }
  } else if (temp === "object") {
    let result = formatOrDefaultValue ? formatOrDefaultValue : "";
    if (!input && input !== 0) return result;
    return filter[input.toString()] || input;
  }
};

// 匹配大小写数字任意
const matchULN = (v) => {
  const REX = /^[a-zA-Z0-9]+$/;
  return REX.test(v);
};
// 字符串是否中文
const isChinese = (str) => {
  var re = /[^\u4E00-\u9FA5]/;
  if (re.test(str)) return false;
  return true;
};
//判断字符串首位带不带'/'
const isSlash = (value) => (value?.slice(0, 1) === "/" ? true : false);

const getCurYearMonth = () => {
  const currentYear = moment().utc().add(8, "hour").format("YYYY");
  const currentMonth = moment().utc().add(8, "hour").format("MM");
  let titleMonth = null;
  if (["01", "02", "03"].includes(currentMonth)) {
    titleMonth = "Q1";
  } else if (["04", "05", "06"].includes(currentMonth)) {
    titleMonth = "Q2";
  } else if (["07", "08", "09"].includes(currentMonth)) {
    titleMonth = "Q3";
  } else {
    titleMonth = "Q4";
  }
  return { currentYear, titleMonth };
};
const deteleStrSpace = (str) => {
  if (str) {
    return str.replace(/\s/g, "");
  }
};
//默认头像
const defaultAvatar = () => {
  return require("../../images/no_pic150.jpg");
};
//合并language_obj & country_obj
const getLanguageCountry = () => {
  const languageObj = JSON.parse(localStorage.getItem("languageCodeList"));
  const countryObj = JSON.parse(localStorage.getItem("countryCodeList"));
  let libData = {};
  const forMap = (arr) => {
    arr?.forEach((item) => {
      libData[item.v] = item.t;
    });
  };
  forMap(languageObj);
  forMap(countryObj);
  return libData;
};
//数据下载到本地文件
const downloadCodeCSV = (data) => {
  let downLink = document.createElement("a");
  downLink.download = "DownloadCode.csv";
  downLink.style.display = "none";
  let blob = new Blob([JSON.parse(JSON.stringify(data))]);
  downLink.href = URL.createObjectURL(blob);
  document.body.appendChild(downLink);
  downLink.click();
  document.body.removeChild(downLink);
};

const deleteEmptyObj = (obj) => {
  let result = obj;
  for (let i in result) {
    if (result[i] !== 0 && !result[i]) {
      delete result[i];
    }
  }
  return result;
};
const getCurYear = () => {
  return new Date().getUTCFullYear();
};
const monthsShort = () => {
  return moment.monthsShort();
};
const sum = (arr) => {
  return arr.reduce((total, num) => total + num);
};

// {pay_type: 12, name: "Yandex"} ==> {v: 12, t: 'Yandex}
const vtPaymentConfig = (arr) => {
  let result = [];
  arr.map((item) => result.push({ v: item.pay_type, t: item.name }));
  return result;
};

const vtPaymentSuppliers = (arr, type) => {
  let result = [];
  arr.map((item) =>
    result.push({
      [type === "vt" ? "v" : "value"]: item.id,
      [type === "vt" ? "t" : "label"]: item.pay_supplier_name,
    })
  );
  return result;
};

const objToArr = (obj) => {
  let arr = [];
  for (let i in obj) {
    let o = {};
    o[i] = obj[i];
    arr.push(o);
  }
  return arr
};
export {
  diff,
  vtObj,
  vtPaymentConfig,
  vtPaymentSuppliers,
  vtSubAccounts,
  stringFormat,
  identicalProperty,
  commonFilter,
  translateOptions,
  deleteEmptyProperty,
  matchULN,
  getCurYearMonth,
  deteleStrSpace,
  defaultAvatar,
  getLanguageCountry,
  isChinese,
  isSlash,
  downloadCodeCSV,
  deleteEmptyObj,
  getCurYear,
  monthsShort,
  sum,
  arrayOptions,
  objToArr
};

import { vtObj } from "../../components/CommonComponent/CommonFunction";
const languages = require("../../Untils/lang.json");
const countrys = require("../../Untils/country.json");

let voucherAccount = {};
JSON.parse(localStorage.getItem("voucherAccounts")).map((item) =>
  Reflect.set(voucherAccount, item.id, item.name)
);
let allVoucherAccounts = {
  102: "GIFTCARD",
  209: "HR General Account",
  203: "Service General Account",
  120: "Technology General Account",
  204: "Product General Account",
  ...voucherAccount,
};

let currentUserTeamId = JSON.parse(localStorage.getItem("oms.user"))
  ? JSON.parse(localStorage.getItem("oms.user"))["oms_team_obj"]["account_id"]
  : 999;
if (currentUserTeamId === 0) {
  currentUserTeamId = 501;
}
let voucherShowType = [];
let temp = vtObj({
  120002: "Tech - Staff Testing",
  203005: "Service - Credit Coupon Refund",
  204002: "Product - Staff Testing",
  209002: "HR - Staff Voucher Benefit",
  209003: "HR - Interview Candidate Voucher Benefit",
  501001: "Marketing - General Campaign",
  501002: "Marketing - Language Challenge Campaign",
});

if (currentUserTeamId === 1) {
  voucherShowType = temp;
} else {
  voucherShowType = temp.filter(
    (item) => item.v.substr(0, 3) === currentUserTeamId.toString()
  );
}

const lessonCouponTypes = ["120003", "203006", "204003", "501050", "501051"];
const purchaseCouponTypes = ["120002", "203005", "204002", "501001", "501002"];
const languageTestCouponTypes = ["120004", "203009", "204004", "501003"];
// const languageTestCouponTypes = {
//     '120004': "Tech - Staff Testing Language Test Coupon",
//     '203009': "Service - Language Test Coupon Refund",
//     '204004': "Product - Staff Testing Language Test Coupon",
//     '501003': "Marketing - Language Test Coupon"
// }
const allShowType = {
  120002: "Tech - Staff Testing",
  203005: "Service - Credit Coupon Refund",
  204002: "Product - Staff Testing",
  209002: "HR - Staff Voucher Benefit",
  209003: "HR - Interview Candidate Voucher Benefit",
  501001: "Marketing - General Campaign",
  501002: "Marketing - Language Challenge Campaign",
  120003: "Tech - Staff Testing Lesson Coupon",
  203006: "Service - Lesson Coupon Refund",
  204003: "Product - Staff Testing Lesson Coupon",
  501050: "Marketing - General Campaign Lesson Coupon",
  501051: "Marketing - Language Challenge Campaign Lesson Coupon",
  120004: "Tech - Staff Testing Language Test Coupon",
  203009: "Service - Language Test Coupon Refund",
  204004: "Product - Staff Testing Language Test Coupon",
  501003: "Marketing - Language Test Coupon",
};
const sessionTypes = {
  1: "Lesson type V Single",
  2: "Lesson type V Package",
  3: "Lesson type V Trial",
  4: "Lesson type V Instant",
};
const LanguageTestCouponType = {
  EMMERSION: "Emmersion Test Coupon",
  OOPT: "OOPT Test Coupon",
};

const validDateCondition = {
  1: "Voucher Valid Date(UTC)",
  2: "Voucher Valid Days",
};

const showTypeObj = {
  120002: "Tech - Staff Testing",
  203005: "Service - Credit Coupon Refund",
  204002: "Product - Staff Testing",
  209002: "HR - Staff Voucher Benefit",
  209003: "HR - Interview Candidate Voucher Benefit",
  501001: "Marketing - General Campaign",
  501002: "Marketing - Language Challenge Campaign",
};

// const voucherAccount = {
//   102: "GIFTCARD",
//   501: "Marketing Voucher Account",
//   209: "HR General Account",
//   203: "Service General Account",
//   120: "Technology General Account",
//   204: "Product General Account",
// };

const voucherCategory = {
  0: "New application",
  1: "Available",
  2: "Unavailable",
  9: "Completed",
};

const conditionType = {
  1: "Redeem USD Directly",
  2: "Buy $x get x USD Credits for free",
  3: "Buy $x get $x off",
  4: "Free",
};

const usage = {
  1: "Once",
  0: "Unlimited",
};

const categoryType = {
  0: "内部系统生成code",
  1: "系统根据条件自动发送券",
  3: "网站用户触发领券",
};

const timeType = {
  0: "Create Time",
  1: "Start Time",
  2: "End Time",
};

const regional = {
  1: "Global",
  2: "China",
  3: "EASEA",
};

const amount = {
  100: "Generate 100 vouchers",
  200: "Generate 200 vouchers",
  500: "Generate 500 vouchers",
  1000: "Generate 1000 vouchers",
  5000: "Generate 5000 vouchers",
  10000: "Generate 10000 vouchers",
  0: "Customize",
};

const eachAmount = {
  50: "Generate 50 vouchers",
  100: "Generate 100 vouchers",
  200: "Generate 200 vouchers",
  500: "Generate 500 vouchers",
  1000: "Generate 1000 vouchers",
  0: "Customize",
};
const remainNumber = {
  "": "Unlimited",
  50: "Use 50 times",
  100: "Use 100 times",
  200: "Use 200 times",
  500: "Use 500 times",
  1000: "Use 1000 times",
  0: "Customize",
};
const channelType = {
  1: "[1]Global",
  2: "[2]China",
  3: "[3]EASEA",
};

const userIdentity = {
  1: "Non-paid users only",
  2: "Paid users",
  // '3': 'Professional teacher',
  // '4': 'Community tutor'
};

const voucherSource = {
  1: "Partnership",
  2: "Source code",
  // '3': 'Global site',
  // '4': 'CN site'
};
const statusOptions = [
  {
    label: "Choose",
    value: "",
  },
  {
    label: "Available",
    value: 1,
  },
  {
    label: "Unavailable",
    value: 2,
  },
  {
    label: "Completed",
    value: 9,
  },
];

const totalAmountGeneration = [
  { label: "Customize", value: "" },
  { label: "Unlimited", value: "-1" },
  { label: "Generate 100 vouchers", value: "100" },
  { label: "Generate 200 vouchers", value: "200" },
  { label: "Generate 500 vouchers", value: "500" },
  { label: "Generate 1000 vouchers", value: "1000" },
  { label: "Generate 5000 vouchers", value: "5000" },
  { label: "Generate 10000 vouchers", value: "10000" },
];
const eachAmountGeneration = [
  { label: "Customize", value: "" },
  { label: "Generate 50 vouchers", value: "50" },
  { label: "Generate 100 vouchers", value: "100" },
  { label: "Generate 200 vouchers", value: "200" },
  { label: "Generate 500 vouchers", value: "500" },
  { label: "Generate 1000 vouchers", value: "1000" },
  { label: "Generate 5000 vouchers", value: "5000" },
];

const languageObjs = languages.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.v]: currentValue.t,
    };
  },
  {},
  0
);

const countryObjs = countrys.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.v]: currentValue.t,
    };
  },
  {},
  0
);
const isAllAbove = {
  0: "Either of those above",
  1: "All above",
};

const duration = {
  "": "Unlimited",
  7: "7 days",
  14: "14 days",
  30: "30 days",
  0: "Customize",
};

const lessonStatus = {
  "": "Unlimited",
  1: "Lesson requested",
  2: "Lesson completed",
};

const packageStatus = {
  "": "Unlimited",
  1: "Package requested",
  2: "Package completed",
};

const creditsPurchase = {
  "": "Unlimited",
  10: "10 USD",
  50: "50 USD",
  100: "100 USD",
  0: "Customize",
};

const otherProducts = {
  "": "Unlimited",
  1: "OOPT",
};

const voucherCategoryStatus = {
  0: "New application",
  1: "Available",
  2: "Unavailable",
  9: "Completed",
};
const voucherUserIdentity = {
  1: "Non-paid users only",
  2: "Paid users",
  3: "Professional teacher",
  4: "Community tutor",
};
const voucherRefSource = {
  1: "Partnership",
  2: "Source code",
  3: "Global site",
  4: "CN site",
};
const voucherCondition = (condition, condition_json, voucher_value) => {
  if (!condition) return;
  let getX = voucher_value,
    buyX = (JSON.parse(condition_json).UseLimitITC / 100).toFixed(2);
  switch (condition?.toString()) {
    case "1":
      return "Redeem USD Directly";
    case "2":
      if (buyX > 0 && getX > 0) return `Buy ${buyX} get ${getX} USD for free`;
      return "Buy $x get x USD for free";
    case "3":
      if (buyX > 0 && getX > 0) return `Buy ${buyX} get ${getX} off`;
      return "Buy $x get $x off";

    default:
      return condition;
  }
};
const voucherConditionJson = (condition, voucher_value, condition_json) => {
  if (condition === undefined || condition === null || condition === "") {
    return "";
  }
  switch (condition?.toString()) {
    case "1":
      return "Redeem USD Directly";
    case "2":
    case "3":
      condition_json = JSON.parse(condition_json);
      let getX = (voucher_value / 100).toFixed(2),
        buyX = (condition_json.UseLimitITC / 100).toFixed(2);
      if (condition?.toString() === "2")
        return `Buy $${buyX} get ${getX} USD for free`;
      return `Buy $${buyX} get $${getX} off`;

    default:
      return condition;
  }
};
const WithdrawalAccountType = (list) => {
  let typeArr = [];
  const paymentConfig = JSON.parse(localStorage.getItem("paymentConfig"));
  paymentConfig.map((i) => {
    return list.map(
      (j) =>
        i.pay_type === j.account_type &&
        typeArr.push({
          name: i.name,
          pay_type: j.account_type,
          account: j.account,
        })
    );
  });
  return typeArr;
};

export {
  voucherCondition,
  voucherConditionJson,
  voucherUserIdentity,
  voucherRefSource,
  voucherCategoryStatus,
  sessionTypes,
  currentUserTeamId,
  allShowType,
  lessonCouponTypes,
  purchaseCouponTypes,
  otherProducts,
  creditsPurchase,
  lessonStatus,
  packageStatus,
  voucherAccount,
  allVoucherAccounts,
  showTypeObj,
  voucherShowType,
  voucherCategory,
  conditionType,
  usage,
  categoryType,
  timeType,
  regional,
  eachAmount,
  remainNumber,
  amount,
  userIdentity,
  voucherSource,
  languageObjs,
  countryObjs,
  isAllAbove,
  duration,
  validDateCondition,
  channelType,
  statusOptions,
  totalAmountGeneration,
  eachAmountGeneration,
  LanguageTestCouponType,
  languageTestCouponTypes,
  WithdrawalAccountType,
};

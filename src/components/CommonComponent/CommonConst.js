import { vtSubAccounts } from "./CommonFunction";

const allSubAccounts = JSON.parse(localStorage.getItem("subAccounts"));
// parent_id === 100 - 子账户
const subAccountsArr_100 = allSubAccounts?.filter(
  (item) => item.parent_id === 100
);
const subAccountVT = vtSubAccounts(subAccountsArr_100);
//Revenue Recognition 选项
const recognition = allSubAccounts?.filter(
  (item) => item.costcenter_code === "SYS_REVENUE"
);

// 礼物卡列表弹框项："Student Wallet", "Teacher Wallet", "Affiliate Wallet"
const WalletDetail = [
  {
    name: "Student Wallet",
    childs: ['Total Balance', 'Available Balance', 'Wallet Freeze', 'Trading Freeze', 'Purchase', 'Purchase Refund'],
  },
  {
    name: "Teacher Wallet",
    childs: ['Total Balance', 'Available Balance', 'Wallet Freeze', 'Withdrawal Freeze', 'Income Pending', 'Withdrawal Pending', 'Withdraw'],
  },
  {
    name: "Affiliate Wallet",
    childs: ['Total Balance', 'Total Amount Earned', 'Total Amount Withdrawn', 'Pending Withdrawal', 'Current Withdrawal Request'],
  },
];
const NOT_PAY_METHODS = [30,31,40,41]
const WithdrawMethod = [0,2,3,5,7,30,31,40,41]
const FMSCONSTANT = {
  TOKEN: 'token',
  TOKEN_HEADER: 'x-token',
  USER: 'user',
  VERSION: 'version',
  EXPIRY_DATE: 'expiry-date',
  PERMI_TYPE_V_SUPER: 99,
  ITALKI_WALLET_SCOPE: 9999,
  // BOS min id
  ORGANIZ_WALLET_MIN_ID: 1999900000
};

export { subAccountsArr_100, subAccountVT, recognition, WalletDetail, FMSCONSTANT, NOT_PAY_METHODS,WithdrawMethod };

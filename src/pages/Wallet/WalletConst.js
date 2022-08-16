import { FMSCONSTANT } from "../../components/CommonComponent/CommonConst";
const WalletDesc = [
  { value: "user_id", desc: "Sort By: User ID Desc" },
  { value: "sv", desc: "Sort By: S Wallet Desc" },
  { value: "tv", desc: "Sort By: T Wallet Desc" },
  { value: "av", desc: "Sort By: A Wallet Desc" },
];
const WalletLiabilitiesDesc = [
  { value: "create_time", desc: "Sort By: Create Time Desc" },
  { value: "negative_sv", desc: "Sort By: S Liability Desc" },
  { value: "negative_tv", desc: "Sort By: T Liability Desc" },
];
const UserWalletOperations = [
  { per: 1002101, key: "1", name: "Frozen S Wallet" },
  { per: 1002103, key: "2", name: "Get Credits from Students" },
  { per: 1002103, key: "3", name: "Get Credits from Teachers" },
  { per: 1002104, key: "4", name: "Give Credits To Students Wallet" },
  { per: 1002104, key: "5", name: "Give Credits To Teachers Wallet" },
];
const WalletLiabilities = [
  { per: 1002701, key: "S", name: "Add Student Liabilities" },
  { per: 1002701, key: "T", name: "Add Teacher Liabilities" }
];
const ConfiscatedStudent = [
  { v: 106101, t: "Credit Expiry" },
  { v: 106102, t: "Chargeback - No Fraud" },
  { v: 106107, t: "Chargeback - Only Student Fraud" },
  { v: 106108, t: "Chargeback - Student Teacher Co Fraud" },
  { v: 106103, t: "Completed Lesson Adjustment - No Fraud" },
  { v: 106109, t: "Completed Lesson Adjustment - Only Student Fraud" },
  { v: 106110, t: "Completed Lesson Adjustment - Student Teacher Co Fraud" },
  { v: 106111, t: "Early Fraud Warning - Only Student Fraud" },
  { v: 106112, t: "Early Fraud Warning - Student Teacher Co Fraud" },
  { v: 106105, t: "Account Removed" },
  { v: 106106, t: "Operation Error" },
];
const ConfiscatedTeacher = [
  { v: 108101, t: "Credit Expiry" },
  { v: 108102, t: "Chargeback" },
  { v: 108103, t: "Completed Lesson Adjustment" },
  { v: 108104, t: "Early Fraud Warning" },
  { v: 108105, t: "Account Removed" },
  { v: 108106, t: "Operation Error" },
  { v: 116101, t: "Teacher Service Fee" },
];
const CreditsStudent = [
  { v: 202001, t: "Marketing - General Campaign Bonus", r: 1 },
  { v: 202002, t: "Marketing - General Campaign Fee Refund", r: 1 },
  { v: 202003, t: "Marketing - LC Campaign Bonus", r: 1 },
  { v: 203010, t: "Service - Community Campaign Bonus" },
  { v: 203001, t: "Completed Lesson Adjustment" },
  { v: 203002, t: "Student Expiry Credit Refund" },
  { v: 203007, t: "Operation Error Refund Student" }
];
const CreditsTeacher = [
  { v: 203050, t: "Completed Lesson Adjustment" },
  { v: 203051, t: "Teacher Expiry Credit Refund" },
  { v: 203052, t: "Operation Error Refund Teacher" },
  { v: 202051, t: "Marketing - General Campaign Bonus", r: 1 },
];
const Regional = [
  { v: 1, t: "Global" },
  { v: 2, t: "China" },
  { v: 3, t: "EASEA" },
];
const UserIdType = (userId) => {
  if (userId < FMSCONSTANT.ITALKI_WALLET_SCOPE) return 2;
  if (userId >= FMSCONSTANT.ORGANIZ_WALLET_MIN_ID) return 3;
  return 1;
};
const WalletType = (input, onlyType) => {
  let str =
    {
      0: "Student",
      1: "Teacher",
      2: "Affiliate",
    }[input.toString()] || input.toString();
  if (onlyType) return str;
  return str + " Wallet";
};
const BOSWalletListOperations = [
  { per: 1001100, key: "1", name: "View BOS Purchase History" },
  { per: 1002100, key: "2", name: "View Transaction Detail" },
  { per: 1002401, key: "3", name: "Transfer credits" },
  { per: 1002402, key: "4", name: "Get Credits from BOS" },
  { per: 1002403, key: "5", name: "Give Credits to BOS" },
];
const GetSelectList = [
  { label: 'BOS Admin Fee', value: 107101 },
  { label: 'BOS Set Up Fee', value: 107102 },
  { label: 'Operation Error', value: 106106 }
];
const GiveSelectList = [
  { label: 'Tech Staff Testing', value: 120001 },
  { label: 'Product Staff Testing', value: 204001 },
  { label: 'Staff Credit Benefit', value: 209001 },
  { label: 'Operation Error', value: 203007 },
  { label: 'Others', value: 202005 }
]
const WalletBOSTransfer = [
  {v: 'organiz_id', name: 'BOS ID'},
  {v: 'from_wallet_id', name: 'From Wallet Id'},
  {v: 'to_wallet_id', name: 'To Wallet Id'},
  {v: 'order_id', name: 'Order Id'}
]
export {
  WalletDesc,
  UserWalletOperations,
  ConfiscatedStudent,
  ConfiscatedTeacher,
  CreditsStudent,
  CreditsTeacher,
  Regional,
  UserIdType,
  WalletType,
  BOSWalletListOperations,
  GetSelectList,
  GiveSelectList,
  WalletBOSTransfer,
  WalletLiabilitiesDesc,
  WalletLiabilities
};

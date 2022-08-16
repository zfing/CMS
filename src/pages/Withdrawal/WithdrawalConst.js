const TWithdrawDesc = [
  { value: "create_time", desc: "Sort By: Apply Time Desc" },
  { value: "finish_time", desc: "Sort By: Update time Desc" }
];
const TWithdrawOperations = [
  { per: 1003104, key: "B1", name: "Add New Withdrawal" },
  { per: 1003101, key: "B2", name: "Approve Same Application" },
  { per: 1003100, key: "B3", name: "Download Withdrawal List With current filters" },
  { per: 1003100, key: "B4", name: "Download Withdrawal Complete CSV Template" },
  { per: 1003102, key: "B5", name: "Batch to complete by CSV" },
  { per: 1003105, key: "B6", name: "Batch upload to Hyperwallet back office" },
];
const AWithdrawOperations = [
  { per: 1003201, key: "B1", name: "Download Withdrawal List" },
  { per: 1003201, key: "B2", name: "Batch to complete by CSV" },
  { per: 1003104, key: "B3", name: "Add New Withdrawal" },
];
const timeType = {
  0: "Create Time",
  1: "Update Time"
};
const WithdrawStatus = [
  {v:'0', t:'(0)Pending Approval'},
  {v:'1', t:'(1)Approved; will pay'},
  {v:'7', t:'(7)Cash has been paid'},
  {v:'3', t:'(3)Unapproved'},
  {v:'5', t:'(5)Teacher canceled'},
  {v:'4', t:'(4)ITALKI Canceled'},
  {v:'2', t:'(2)Completed'},
  {v:'6', t:'(6)Withdrawal reversed'}
]
const WithdrawMethod = [0,2,3,5,7,30,31,40,41]
const WithdrawalType = [
  {v: '1', t: 'Not immediately'},
  {v: '2', t: 'Immediately'}
]
const TWithdrawListOperations = [
  { per: 1003101, key: "1", name: "Approve" },
  { per: 1003101, key: "2", name: "Reject" },
  { per: 1003102, key: "3", name: "Cash Paid" },
  { per: 1003102, key: "4", name: "Withdrawal to complete" },
  { per: 1003101, key: "5", name: "Cancel" },
  { per: 1003103, key: "6", name: "Cash Refund" },
  { per: null, key: "7", name: "View Withdrawal History" },
  { per: null, key: "8", name: "Check Payoneer Status" },
];
const AWithdrawListOperations = [
  { per: 1003101, key: "1", name: "Approve" },
  { per: 1003101, key: "2", name: "Reject" },
  { per: 1003201, key: "3", name: "Cash Paid" },
  { per: 1003201, key: "4", name: "Withdrawal to complete" },
  { per: 1003101, key: "5", name: "Cancel" },
  { per: null, key: "7", name: "View Withdrawal History" },
  { per: null, key: "8", name: "Check Payoneer Status" },
];
const SameWithdrawalTimes = [
  { key: "5", name: "At least 5 times same withdrawa" },
  { key: "4", name: "At least 4 times same withdrawal" },
  { key: "3", name: "At least 3 times same withdrawal" },
  { key: "2", name: "At least 2 times same withdrawal" },
  { key: "", name: "Customize" }
];
const downloadData = [
  {
    postParam: "order_id",
    title: "ORDER ID",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "user_id",
    title: "TEACHER ID",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "amount",
    title: "AMOUNT ($)",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "account",
    title: "ACCOUNT",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "withdraw_type",
    title: "WITHDRAW TYPE",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "status",
    title: "STATUS",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "account_type",
    title: "ACCOUNT TYPE",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "account_comment",
    title: "ACCOUNT OTHER",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "create_time",
    title: "APPLY TIME",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "finish_time",
    title: "FINISH TIME",
    defaultValue: 0,
    span: 24,
  }
]
const AdownloadData = [
  {
    postParam: "order_id",
    title: "ORDER ID",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "user_id",
    title: "AFFILIATE ID",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "amount",
    title: "AMOUNT",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "account",
    title: "ACCOUNT($)",
    defaultValue: 1,
    span: 24,
  },
  {
    postParam: "status",
    title: "STATUS",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "account_type",
    title: "ACCOUNT TYPE",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "account_comment",
    title: "ACCOUNT OTHER",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "create_time",
    title: "APPLY TIME",
    defaultValue: 0,
    span: 24,
  },
  {
    postParam: "finish_time",
    title: "FINISH TIME",
    defaultValue: 0,
    span: 24,
  }
]
const PreviewData = ['money','currency','bill_id','pay_date','pay_user','italki_fee','third_fee','is_mass','is_immediate','remark']

export {
  TWithdrawDesc,
  TWithdrawOperations,
  AWithdrawOperations,
  timeType,
  WithdrawStatus,
  WithdrawMethod,
  WithdrawalType,
  TWithdrawListOperations,
  AWithdrawListOperations,
  SameWithdrawalTimes,
  downloadData,
  AdownloadData,
  PreviewData
}
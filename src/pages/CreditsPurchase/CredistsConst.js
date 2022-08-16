const DeviceType = [
  { v: 0, t: "[0]Classic italki [Old]" },
  { v: 1, t: "[1]Global Mobile App [Old]" },
  { v: 2, t: "[2]Global Android App [Old]" },
  { v: 3, t: "[3]Global iOS App [Old]" },
  { v: 4, t: "[4]WeChat official account [Old]" },
  { v: 5, t: "[5]Classic CN Web [Old]" },
  { v: 7, t: "[7]CN iOS App [Old]" },
  { v: 8, t: "[8]CN Lite [Old]" },
  { v: 9, t: "[9]WeChat APP" },
  { v: 10, t: "[10]Global Student web" },
  { v: 11, t: "[11]Global Teacher web" },
  { v: 12, t: "[12]Android App Rigel" },
  { v: 13, t: "[13]Stardust iOS App [Old]" },
  { v: 15, t: "[15]CN Web Orion" },
  { v: 16, t: "[16]App WebView Teacher/Community" },
  { v: 23, t: "[23]iOS App Rigel" },
]
const OrderTag = [
  { t: "Normal", v: "0" },
  { t: "Fraudulent", v: "1" },
  { t: "Unsatisfied", v: "2" },
  { t: "Duplicate", v: "3" },
  { t: "Purchase by mistake", v: "4" },
  { t: "Requested by customer", v: "5" },
  { t: "Internal testing", v: "6" },
  { t: "Suspicious Fraud", v: "7" },
  { t: "Blackhole - Refund", v: "8" },
]
const SourceType = [
  { v: '1', t: "Direct Payment" },
  { v: '4', t: "By-GiftCard" },
  { v: '5', t: "By-Lesson" },
  { v: '6', t: "By-Product" },
  { v: '7', t: "By-LanguageChallenge" },
]
const RecordStatus = [
  { t: "Requested", v: "0" },
  { t: "Completed", v: "1" },
  { t: "Pending", v: "2" },
  { t: "Cancelled", v: "3" },
  { t: "Failed", v: "5" },
  { t: "Refunded", v: "6" },
]
const PurchaseRecordsListOperations = [
  { per: 1001101, key: "1", name: "Purchase succeed" },
  { per: 1001103, key: "2", name: "Refund" },
  { per: 1001102, key: "3", name: "Cancel" },
  { per: 1001102, key: "4", name: "Setting Tag" }
];
const UsingStatus = [
  {v: '998', t: 'All'},
  {v: '999', t: 'Enabled'},
  {v: '0', t: 'Disabled'},
  {v: '1', t: 'All Country'},
  {v: '2', t: 'Specified Countries can use'},
  {v: '3', t: 'Specified Countries cannot use'}
]
export {
  DeviceType,
  OrderTag,
  SourceType,
  RecordStatus,
  PurchaseRecordsListOperations,
  UsingStatus
}
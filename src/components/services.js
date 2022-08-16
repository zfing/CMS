import axios from "axios";
import api from "./Api";

// 登录
const login = (params) => {
  return axios.post(`${process.env.REACT_APP_BASE_URL}/fms/login`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};
// 修改密码
const changepwd = (postData) => {
  return api({
    url: `/fms/inner-system-data`,
    method: 'post',
    data: postData
  })
}
// 语言列表
const getLanguageList = (params) => {
  return api({
    url: `${process.env.REACT_APP_CONFIG_URL}/oms/fetch-config-data?fetch_name=language_obj_s`
  })
}

// 国家列表
const getCountryList = (params) => {
  return api({
    url: `${process.env.REACT_APP_CONFIG_URL}/oms/fetch-config-data?fetch_name=country_obj_s`
  })
}

// 登录即取
// payment-config
const getPaymentConfig = () => {
  return api({
    url: `/credits/payment-configs?fetch_name=name_s`
  })
}
// transaction showtypes
const getTransactionShowtype = () => {
  return api({
    url: `/wallet/transaction-showtypes`
  })
}
// Sub Accounts 所有子账户
const getSubAccounts = () => {
  return api({
    url: `italki-internal/sub-accounts`
  })
}
const getVoucherAccounts = () => {
  return api({
    url: `voucher/accounts`
  })
}
//  cost centers
const getCostCenters = () => {
  return api({
    url: `italki-internal/cost-centers`
  })
}
// suppliers
const get_payment_suppliers = () => {
  return api({
    url: `credits/payment-method-suppliers`
  })
}
export {
  login,
  changepwd,
  getLanguageList,
  getCountryList,
  getPaymentConfig,
  getTransactionShowtype,
  getSubAccounts,
  getVoucherAccounts,
  getCostCenters,
  get_payment_suppliers
};

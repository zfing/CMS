import api from "../../../components/Api";

// budget_years
const get_budget_years = () => {
  return api({
    url: `/italki-budget/budgeting?fetch_name=budget_years`
  })
}
// budgeting list
const get_budgeting_List = (params) => {
  return api({
    url: `/italki-budget/budgeting`,
    method: 'get',
    params,
  })
}
//  cost centers
const getCostCenters = () => {
  return api({
    url: `italki-internal/cost-centers`
  })
}

// 校验，添加，编辑
const check_has_budget = (params) => {
  return api({
    url: `/italki-budget/budgeting`,
    method: 'post',
    data: params,
    dataType: 'form'
  })
}

export {
  get_budget_years,
  get_budgeting_List,
  getCostCenters,
  check_has_budget
};

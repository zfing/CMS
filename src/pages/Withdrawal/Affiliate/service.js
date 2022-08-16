import api from "../../../components/Api";

const edit_expandable_cash = (params, mt, id) => {
  return api({
    url: `/withdraw/affiliate-withdrawal/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  })
}

// 编辑
const get_list_log_submit = (params, mt, type) => {
  return api({
    url: `/withdraw/affiliate-withdrawals`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
    ...type
  });
};
export {
  get_list_log_submit,
  edit_expandable_cash
};

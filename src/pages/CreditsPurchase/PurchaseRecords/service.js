import api from "../../../components/Api";

const edit_purchase_or_expandable_list = (params, mt, id) => {
  return api({
    url: `/credits/purchase/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  })
}

// 编辑
const get_list_log_submit = (params, mt) => {
  return api({
    url: `/credits/purchase-list`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};

export {
  get_list_log_submit,
  edit_purchase_or_expandable_list
};

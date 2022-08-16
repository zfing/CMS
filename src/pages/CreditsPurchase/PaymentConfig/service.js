import api from "../../../components/Api";

const get_list_log_submit = (params, mt) => {
  return api({
    url: `/credits/payment-configs`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
// add or detail or delete sort
const add_payment_or_detail = (params, mt, id, type) => {
  return api({
    url: `/credits/payment-config/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
    ...type
  });
};

export {
  get_list_log_submit,
  add_payment_or_detail
};

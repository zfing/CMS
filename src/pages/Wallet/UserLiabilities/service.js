import api from "../../../components/Api";

const log_submit = (params, mt, id) => {
  return api({
    url: `/wallet/user-liabilities/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
// list
const get_list = (params) => {
  return api({
    url: `/wallet/user-liabilities`,
    params,
    method: "get"
  });
};

export { log_submit, get_list };

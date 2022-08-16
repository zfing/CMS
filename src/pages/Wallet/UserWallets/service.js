import api from "../../../components/Api";

const log_submit = (params, mt, id) => {
  return api({
    url: `/wallet/user/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
// list
const get_wallet_list = (params) => {
  return api({
    url: `wallet/list`,
    params,
    method: "get"
  });
};

export { log_submit, get_wallet_list };

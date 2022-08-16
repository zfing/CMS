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
    url: `/wallet/list?fetch_name=italki_wallet`,
    params,
    method: "get"
  });
};

const get_detail = (params, id) => {
  return api({
    url: `/user/${id}/transaction`,
    params,
    method: "get"
  });
};

export { log_submit, get_wallet_list, get_detail };

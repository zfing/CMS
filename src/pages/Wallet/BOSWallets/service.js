import api from "../../../components/Api";
// members list and log sumbit
const get_members_list = (params, mt, id) => {
  return api({
    url: `/wallet/bos/${id}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
// list
const get_list = (params) => {
  return api({
    url: `wallet/list?fetch_name=organization_wallet`,
    params,
    method: "get"
  });
};

// available itc
const get_members_available_itc = (member) => {
  return api({
    url: `/wallet/user/${member}?fetch_name=available_itc`,
    method: "get"
  });
};

export { get_list, get_members_list, get_members_available_itc };

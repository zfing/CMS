import api from "../../../components/Api";
// list
const get_transfers_list = (params) => {
  return api({
    url: '/wallet/organization-transfers',
    params,
    method: "get"
  });
};

export { get_transfers_list };

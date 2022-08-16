import api from "../../../components/Api";

// credit allocations list | Reversed
const get_allocations_List = (params, mt) => {
  return api({
    url: `italki-budget/credit-allocations`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
// Allocate Credits
const allocate_credits = (params) => {
  return api({
    url: `/wallet/italki/100?fetch_name=available_itc`,
    method: "get",
    params,
  });
};

export { get_allocations_List, allocate_credits };

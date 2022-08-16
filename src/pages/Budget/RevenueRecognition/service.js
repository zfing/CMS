import api from "../../../components/Api";

// list | add recognition
const get_recognitions_List = (params, mt) => {
  return api({
    url: `/italki-budget/revenue-recognitions`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};
const get_available_itc = (params) => {
  return api({
    url: `/wallet/italki/${params}?fetch_name=available_itc`,
    method: "get"
  });
};

export { get_recognitions_List, get_available_itc };

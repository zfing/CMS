import api from "../../../components/Api";

const get_list_log_submit = (params, mt) => {
  return api({
    url: `/credits/expired-list`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};

export {
  get_list_log_submit
};

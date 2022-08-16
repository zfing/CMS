import api from "../../../components/Api";

const get_List = (params, mt) => {
  return api({
    url: `withdraw/config-list`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};

export { get_List };

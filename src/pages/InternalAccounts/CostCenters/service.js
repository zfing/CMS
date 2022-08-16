import api from "../../../components/Api";

//  cost centers
const getCostCenters = () => {
  return api({
    url: `italki-internal/cost-centers`
  })
}

// 编辑
const log_submit = (params, mt, type) => {
  return api({
    url: `/italki-internal/cost-center/${type}`,
    method: mt ? mt : "get",
    [mt ? 'data' : 'params'] : params,
  });
};

export {
  getCostCenters,
  log_submit
};

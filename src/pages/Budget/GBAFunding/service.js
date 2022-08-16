import api from "../../../components/Api";

// GBA funding list
const get_funding_List = (params) => {
  return api({
    url: `/italki-budget/gba-funding`,
    method: "get",
    params,
  });
};
// add funding | Reverse
const gba_funding_undo = (postData) => {
  return api({
    url: `/italki-budget/gba-funding`,
    method: "post",
    data: postData,
  });
};

export { get_funding_List, gba_funding_undo };

import axios from "axios";
import qs from "qs";
// import Cookies from "js-cookie";
let api = axios.create({
  headers: {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
});
api.defaults.baseURL = process.env.REACT_APP_BASE_URL;

api.interceptors.request.use(
  (config) => {
    if (config.dataType === 'form') {
      // formData
    } else {
      config.data = qs.stringify(config.data);
    }
    const newConfg = {
      ...config,
      headers: {
        ...config.headers,
        "X-Token": localStorage.getItem("cms.token"),
      },
      //get
      params: {
        ...config.params
      },
      // post
      postData: {
        ...config.data
      }
    };
    return newConfg;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// response 拦截器
api.interceptors.response.use(response => response,
  error => {
    const {status, data}  = error?.response;
    if (status === 417) {
      window.alert('Your token is expired, please login again')
      localStorage.clear()
      return window.location.href = '/login';
    } else if (status === 401) {
        localStorage.removeItem("cms.user");
        localStorage.removeItem("cms.token");
        // Cookies.remove("isLogin");
        window.location.href = "/login";
    } else {
      return Promise.reject(data)
    }
  })
export default api;

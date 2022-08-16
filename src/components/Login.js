import React, { useContext, useState } from "react";
import { Form, Input, Button, notification, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../assets/login.css";
import {
  login,
  getLanguageList,
  getSubAccounts,
  getCountryList,
  getPaymentConfig,
  getTransactionShowtype,
  getVoucherAccounts,
  getCostCenters,
  get_payment_suppliers,
} from "./services";
import _ from "lodash";
// import Cookies from 'js-cookie';
import { FMSContext } from "../App";
const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { dispatch } = useContext(FMSContext);
  const handleSubmit = (values) => {
    setLoading(true);
    const form = new FormData();
    form.append("username", values.username);
    form.append("pwd", values.pwd);
    login(form)
      .then((res) => {
        if (res?.data?.data?.username) {
          setLoading(false);
          dispatch({
            type: "SET",
            data: res.data.data,
          });
          let expiryDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          // Cookies.set('isLogin', '1', { expires: 1 });
          localStorage.setItem("fms.user", JSON.stringify(res.data.data));
          localStorage.setItem("fms.token", res.headers["x-token"]);
          localStorage.setItem("fms.expiry-date", expiryDate);
          props.history.push("/dashboard");
          notification.info({
            message: "Login Success",
          });
          getStaticDatas();
        }
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.response?.data?.error?.msg,
        });
        if (err.response?.data.code === 401) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("fmsToken");
          // Cookies.remove('isLogin');
          props.history.push("/login");
        }
        setLoading(false);
      });
  };
  const getStaticDatas = () => {
    getCountryList().then((result) => {
      localStorage.setItem("countryCodeList", JSON.stringify(result.data.data));
    });
    getLanguageList().then((result) => {
      localStorage.setItem(
        "languageCodeList",
        JSON.stringify(result.data.data)
      );
    });
    getSubAccounts().then((result) => {
      localStorage.setItem("subAccounts", JSON.stringify(result.data.data));
    });
    getPaymentConfig().then((result) => {
      localStorage.setItem("paymentConfig", JSON.stringify(result.data.data));
    });
    getTransactionShowtype().then((result) => {
      localStorage.setItem(
        "transactionShowtype",
        JSON.stringify(result.data.data)
      );
    });
    getVoucherAccounts().then((result) => {
      localStorage.setItem("voucherAccounts", JSON.stringify(result.data.data));
    });
    getCostCenters().then((result) => {
      localStorage.setItem("costCenters", JSON.stringify(result.data.data));
    });
    get_payment_suppliers().then((result) => {
      localStorage.setItem(
        "payment_suppliers",
        JSON.stringify(result.data.data)
      );
    });
  };
  return (
    <div className="container">
      <div className="content">
        {/* <img
          className="login_logo"
          src="https://www.italki.com/static/images/navigation/italki_logo_73x56.svg"
          alt="logo"
        /> */}
        <div className="title">CMS SIGN IN</div>
        <Form
          onFinish={() => props.history.push("/dashboard")}
        //   onFinish={_.debounce(handleSubmit, 500, { trailing: true })}
          form={form}
        >
          <Form.Item
            name="username"
            // rules={[{ required: true, message: "username can't be empty" }]}
          >
            <Input
              prefix={
                <UserOutlined
                  className="site-form-item-icon"
                  style={{ color: "rgba(0,0,0,.25)" }}
                />
              }
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="pwd"
            // rules={[{ required: true, message: "password can't be empty" }]}
          >
            <Input.Password
              prefix={
                <LockOutlined
                  type="user"
                  style={{ color: "rgba(0,0,0,.25)" }}
                />
              }
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Spin spinning={loading}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="login-form-button"
              >
                Login
              </Button>
            </Spin>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

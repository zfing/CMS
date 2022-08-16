import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  Modal,
  Form,
  Select,
  Checkbox,
  Row,
  Col,
  Input,
  Button,
  message,
} from "antd";
import api from "../../../../components/Api";
import _ from "lodash";
import "./detail.css";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { WithdrawalAccountType } from "../../CommonConst";
import { WithdrawMethod } from "../../../../components/CommonComponent/CommonConst";

const Withdrawal = React.forwardRef((props, ref) => {
  const defaultAccountList = JSON.parse(
    localStorage.getItem("paymentConfig")
  ).filter((item) => WithdrawMethod.includes(item.pay_type));
  const { type, userId, fresh } = props;
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(type === "withdrawal" ? false : true);
  const [logModal, setLogModal] = useState(false);
  const [noFetch, setNoFetch] = useState(true);
  const [secletAccount, setSecletAccount] = useState("");
  const [accountValue, setAccountValue] = useState("");
  const [curId, setCurId] = useState(null);
  const [credit, setCredit] = useState(null);
  const [comment, setComment] = useState(null);
  const [account_type, setAccount_type] = useState(null);
  const [accountTypeList, setAccountTypeList] = useState(
    type === "withdrawal" ? defaultAccountList : []
  );
  const [activeKey, setActiveKey] = useState("1");
  const [form] = Form.useForm();

  useEffect(() => {
    visible && type === "voucher" && fetch(userId);
  }, [visible, userId, type]);

  const fetch = (id) => {
    api
      .get(`/withdraw/config-list?user=${id}`)
      .then((res) => {
        setAccountTypeList(res?.data?.data);
      })
      .catch((err) => {
        message.error(err?.error?.msg);
      });
  };

  useImperativeHandle(ref, () => ({
    open: (key) => {
      setActiveKey(key);
      setVisible(true);
    },
  }));
  const handleCloseDetail = () => {
    setVisible(false);
    setNoFetch(false);
    setChecked(type === "withdrawal" ? false : true);
    setSecletAccount("");
    setCredit(null);
    setComment(null);
    setCurId(null);
    setAccountValue(null);
  };
  const confirm = (log_note) => {
    let postData = {
      log_note,
      user: type === "withdrawal" ? curId : userId,
      operate: activeKey === "2" ? "add" : "add_withdraw",
      account_type,
    };
    if (!checked) {
      postData["account_comment"] = comment;
      postData["account"] = accountValue;
    }
    if (activeKey === "2") {
      postData["itc"] = credit * 100;
    }
    api
      .post(
        activeKey === "2"
          ? "/withdraw/teacher-withdrawals"
          : "/withdraw/affiliate-withdrawals",
        postData
      )
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        if (success) {
          logModal.onCancel();
          handleCloseDetail();
          message.success("Success");
          fresh();
        }
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };
  const isDisabled = () => {
    if (!checked) {
      if (activeKey === "2") {
        return !comment || !accountValue || !credit;
      }
      return !comment || !accountValue;
    } else {
      if (activeKey === "2") {
        return !secletAccount || !credit;
      }
      return !secletAccount;
    }
  };
  const disabledFunc = () => {
    if(type === "withdrawal") {
      if(!checked && !curId) {
        return true
      } return false
    }
  }
  return (
    <Modal
      visible={visible}
      onCancel={handleCloseDetail}
      destroyOnClose
      title="Add withdrawal"
      width={"45%"}
      maskClosable={false}
      footer={[
        <Button key="1" onClick={handleCloseDetail}>
          Cancel
        </Button>,
        <Button
          disabled={isDisabled()}
          key="2"
          type="primary"
          onClick={form.submit}
        >
          Comfirm
        </Button>,
      ]}
    >
      <Form
        {...formItemLayout}
        form={form}
        preserve={false}
        onFinish={() => logModal.onShow()}
        className="border-bt"
      >
        <Form.Item
          name="user"
          initialValue={type === "withdrawal" ? null : userId}
          label={`Withdraw of ${activeKey === "2" ? "teacher" : "affiliate"}`}
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input
            placeholder=""
            onChange={_.debounce((e) => setCurId(Number(e.target.value)), 500, {
              trailing: true,
            })}
            disabled={type === "voucher"}
          />
        </Form.Item>
        {activeKey === "2" && (
          <Form.Item
            name="itc"
            label="Withdraw Value (USD)"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input
              placeholder="Please enter a number"
              onChange={_.debounce(
                (e) => setCredit(Number(e.target.value)),
                500,
                {
                  trailing: true,
                }
              )}
            />
          </Form.Item>
        )}
      </Form>
      <Checkbox
        className={`text-bold ${checked && "blue"}`}
        onChange={(e) => {
          const check = e.target.checked;
          if (check && type === "withdrawal") {
            setNoFetch(false)
            fetch(curId);
          }
          if(type === "withdrawal" && !check) {
            setAccountTypeList(defaultAccountList)
            setNoFetch(true)
          }
          setChecked(!checked);
        }}
        defaultChecked={type === "withdrawal" ? false : true}
        disabled={disabledFunc()}
        // disabled={type === "withdrawal" && !curId}
        checked={checked}
      >
        Use of existing withdrawal accounts
      </Checkbox>
      <Row
        className="margin-10-0-10-0"
        align="middle"
        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 0]}
        justify="space-between"
      >
        <Col span={5} className="padding-right-0">
          <span>Account Type</span>
        </Col>
        <Col span={7} className="padding-right-0 padding-left-0">
          <Select
            style={{ width: "100%" }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => {
              setAccount_type(value);
              const cur = accountTypeList?.find(
                (item) => item.account_type === value
              );
              setSecletAccount(cur?.["account"]);
            }}
            defaultValue={""}
          >
            <Select.Option value={""} key="-1">
              Choose
            </Select.Option>
            {(type === "withdrawal" && noFetch ? accountTypeList : WithdrawalAccountType(accountTypeList)).map((item) => (
              <Select.Option value={item.pay_type} key={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col className="padding-right-0 padding-left-0" span={3} offset={1}>
          Account
        </Col>
        <Col className="padding-left-0" span={8}>
          <Input
            disabled={checked}
            onChange={(e) => setAccountValue(e.target.value)}
            value={checked ? secletAccount : accountValue}
          />
        </Col>
      </Row>
      {!checked && (
        <Row
          justify="space-between"
          align="middle"
          gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 0]}
        >
          <Col
            style={{ textAlign: "center" }}
            className="padding-right-0"
            span={5}
          >
            Account Comment
          </Col>
          <Col className="padding-left-0 padding-right-0" span={7}>
            <Input.TextArea
              defaultValue={comment}
              onChange={_.debounce((e) => setComment(e.target.value), 500, {
                trailing: true,
              })}
            />
          </Col>
          <Col span={4}></Col>
          <Col span={8}></Col>
        </Row>
      )}
      <WriteLog
        title="Add withdrawal"
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
      />
    </Modal>
  );
});

export default Withdrawal;

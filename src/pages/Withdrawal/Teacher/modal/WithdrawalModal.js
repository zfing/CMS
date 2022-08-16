import React, { useState, useImperativeHandle } from "react";
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
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { WithdrawMethod } from "../../WithdrawalConst";

const Withdrawal = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [accountValue, setAccountValue] = useState(null);
  const [credit, setCredit] = useState(null);
  const [comment, setComment] = useState(null);
  const [account_type, setAccount_type] = useState(null);
  const [activeKey, setActiveKey] = useState("1");
  const [curUser, setCurUser] = useState(null);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (key) => {
      setActiveKey(key);
      setVisible(true);
    },
  }));
  const handleCloseDetail = () => {
    setVisible(false);
    setChecked(false);
    setCredit(null);
    setComment(null);
    setAccountValue(null)
  };
  const confirm = (log_note) => {
    let postData = {
      log_note,
      user: curUser,
      operate: activeKey === "2" ? "add" : "add_withdraw",
      account_type,
      account: accountValue
    };
    if (!checked) {
      postData["account_comment"] = comment;
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
          props.update();
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
    const flag = !account_type || !accountValue
    if(!checked) {
      return !comment || flag
    } else {
      return flag
    }
  };
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
          label={`Withdraw of ${activeKey === "2" ? "teacher" : "affiliate"}`}
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input
            placeholder="ID / Email"
            onChange={_.debounce(
              (e) => setCurUser(e.target.value),
              500,
              {
                trailing: true,
              }
            )}
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
        onChange={() => setChecked(!checked)}
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
            }}
            defaultValue={""}
          >
            <Select.Option value={""} key="-1">
              Choose
            </Select.Option>
            {JSON.parse(localStorage.getItem("paymentConfig"))
              .filter((item) => WithdrawMethod.includes(item.pay_type))
              .map((item) => (
                <Select.Option value={item.pay_type} key={item.pay_type}>
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
            defaultValue={null}
            onChange={(e) => setAccountValue(e.target.value)}
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

import React, { useState, useImperativeHandle, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Select,
  Checkbox,
  message,
  Button,
} from "antd";
import {
  ConfiscatedStudent,
  ConfiscatedTeacher,
  CreditsStudent,
  CreditsTeacher,
  Regional,
} from "../../WalletConst";
const CreditsFromToST = React.forwardRef((props, ref) => {
  const { onData, title } = props;
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typeST, setTypeST] = useState({ title: "", key: "" });
  const [form] = Form.useForm();
  const textAreaRef = useRef(null);
  const handleOnCancel = () => {
    setChecked(false);
    setVisible(false);
    form.resetFields();
  };
  const tailLayout = {
    wrapperCol: { span: 24 },
    style: {
      margin: "20px 0 -20px",
      padding: "20px 0",
      borderTop: "1px #f0f0f0 solid",
    },
  };
  useImperativeHandle(ref, () => ({
    open: (title, key) => {
      setVisible(true);
      setTypeST({ title, key });
    },
    cancel: () => handleOnCancel(),
  }));
  const onFinish = (values) => {
    const { itc, show_type, channel_type, user_id_s } = values;
    let userIds = [];
    if (user_id_s) {
      let userArr = [];
      if (user_id_s.includes("\n")) {
        userArr = user_id_s.split("\n");
      } else if (user_id_s.includes(",")) {
        userArr = user_id_s.split(",");
      } else {
        userArr.push(user_id_s);
      }
      userArr.map((item) => userIds.push(item));
    }
    if (checked) {
      if (!user_id_s) {
        message.warning("User ID Can't be empty");
        return;
      }
    }
    const params = {
      itc: !itc ? -100 : Number(itc) * 100,
      show_type,
    };
    if (typeST.key === "4") {
      params["channel_type"] = channel_type;
    }
    if (userIds.findIndex((item) => !Number(item)) > -1) {
      message.warning("The wallet ID(s) must be all numbers");
      return false;
    }
    onData(
      {
        ...params,
      },
      userIds.filter((item) => item !== "")
    );
  };
  const selectType = () => {
    let selectArr = [];
    switch (typeST.key) {
      case "2":
        selectArr = ConfiscatedStudent;
        break;
      case "3":
        selectArr = ConfiscatedTeacher;
        break;
      case "4":
        selectArr = CreditsStudent;
        break;
      case "5":
        selectArr = CreditsTeacher;
        break;
      default:
        return null;
    }
    return selectArr;
  };
  return (
    <Modal
      title={title}
      visible={visible}
      okText="Confirm"
      destroyOnClose
      maskClosable={false}
      onCancel={handleOnCancel}
      width="600px"
      footer={null}
    >
      <Form
        form={form}
        colon={false}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          show_type: "",
          channel_type: "",
        }}
      >
        <Form.Item
          label={typeST.title}
          name="show_type"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Select>
            <Select.Option key="-1" value="">
              Choose
            </Select.Option>
            {selectType() &&
              selectType().map((item, index) => (
                <Select.Option key={index} value={item.v}>
                  {item.t}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        {checked ? null : (
          <Form.Item
            name="itc"
            label="USD ($)"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input />
          </Form.Item>
        )}
        {typeST.key === "4" && (
          <Form.Item
            label="Regional"
            name="channel_type"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Select>
              <Select.Option key="-1" value="">
                Choose
              </Select.Option>
              {Regional.map((item) => (
                <Select.Option key={item.t} value={item.v}>
                  {item.t}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {["4", "5"].includes(typeST.key) ? null : (
          <Row justify="end">
            <Checkbox
              checked={checked}
              onClick={(e) => setChecked(e.target.checked)}
            />{" "}
            &nbsp;
            <span
              style={{ color: checked ? "#5db2ff" : "#000" }}
              className="font-weight-bolder"
            >
              Confiscation of all credits
            </span>
          </Row>
        )}

        <Form.Item
          name="user_id_s"
          label="User Wallet ID(s)"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input.TextArea
            ref={textAreaRef}
            rows={5}
            style={{ maxWidth: "100%" }}
          />
        </Form.Item>
        <Row justify="end">
          Please input the wallet's ID in each line in the Text Area above.
        </Row>
        <Form.Item {...tailLayout}>
          <Row justify="end">
            <Button onClick={handleOnCancel} className="margin-right-10">
              {" "}
              Cancle{" "}
            </Button>
            <Button type="primary" htmlType="submit">
              {" "}
              Confirm{" "}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreditsFromToST;

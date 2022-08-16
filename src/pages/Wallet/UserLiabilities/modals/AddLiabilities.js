import React, { useState, useImperativeHandle } from "react";
import { Modal, Form, Input, Button } from "antd";
const AddLiabilities = React.forwardRef((props, ref) => {
  const { onData } = props;
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [itcValue, setItcValue] = useState(0);
  const [form] = Form.useForm();
  const handleOnCancel = () => {
    setVisible(false);
    setItcValue(0)
    form.resetFields();
  };
  useImperativeHandle(ref, () => ({
    open: (title) => {
      setVisible(true);
      setTitle(title);
    },
    cancel: handleOnCancel
  }));
  const onFinish = (values) => {
    const { itc, id } = values;
    onData(
      {
        itc: Number(itc) * 100,
        operate: "add_liabilities",
      },
      id
    );
  };
  return (
    <Modal
      title={title}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={handleOnCancel}
      footer={[
        <Button key="1" onClick={handleOnCancel}>
          Cancle
        </Button>,
        <Button
          key="2"
          type="primary"
          onClick={form.submit}
          disabled={itcValue < 100}
        >
          Confirm
        </Button>,
      ]}
    >
      <Form
        form={form}
        colon={false}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          itc: "",
        }}
      >
        <Form.Item
          label="User ID"
          name="id"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="itc"
          label="Liabilities USD ($)"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input onChange={(e) => setItcValue(Number(e.target.value) * 100)} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddLiabilities;

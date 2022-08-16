import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, message, notification } from "antd";
import { changepwd } from "./services";

const Changepwd = forwardRef((props, ref) => {
  const [changePwdVisible, setChangePwdVisible] = useState(false);
  const [loding, setLoading] = useState(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: () => {
      setChangePwdVisible(true);
      form.resetFields();
    },
  }));
  const onOk = (values) => {
    const { old_pwd, new_pwd, r_new_pwd } = values;
    if (new_pwd !== r_new_pwd) {
      message.error("The two new passwords are inconsistent");
      return;
    }
    setLoading(true);
    const postData = {
      old_pwd,
      new_pwd,
      operate: 'change_self_pwd'
    }
    changepwd(postData)
      .then((res) => {
        res?.data?.data?.success && message.success("success");
        setChangePwdVisible(false);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.error?.msg,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      <Modal
        visible={changePwdVisible}
        title="修改密码"
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setChangePwdVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        width="30%"
        confirmLoading={loding}
      >
        <Form layout="vertical" form={form} onFinish={onOk}>
          <Form.Item
            name="old_pwd"
            label="旧密码"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input type="password" placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            name="new_pwd"
            label="新密码"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input type="password" placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="r_new_pwd"
            label="确认新密码"
            rules={[
              { required: true, message: "不能为空" },
            ]}
          >
            <Input type="password" placeholder="请再输入一次新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});
export default Changepwd;

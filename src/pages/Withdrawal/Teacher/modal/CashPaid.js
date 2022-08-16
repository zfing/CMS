import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, message, Checkbox } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { edit_expandable_cash } from "../service";

const CashPaid = forwardRef((props, ref) => {
  const { keys, update, curItem } = props;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [key, setKey] = useState(null);
  const [formValues, setFormValues] = useState({});

  useImperativeHandle(ref, () => ({
    open: (key) => {
      setVisible(true);
      setKey(key);
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const submit = (log_note) => {
    const { italki_fee } = formValues;
    let postData = {
      log_note,
      operate: "cash_paid",
      italki_fee: italki_fee * 100,
      is_immediate: check ? 1 : 0,
    };
    if(key) {
      edit_expandable_cash(postData, "post", curItem.id)
      .then(res => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        setVisible(false);
        form.setFieldsValue({ italki_fee: 0 });
        setCheck(false);
        setKey(null)
        update();
      })
      .catch((err) => message.error(err?.error?.msg));
    } else {
      Promise.all(
        keys.map((id) => edit_expandable_cash(postData, "post", id))
      )
      .then(res => {
        res.forEach((result) => {
          const {
            data: { data: success },
          } = result;
          success && message.success("Success");
          logModal.onCancel();
          setVisible(false);
          form.setFieldsValue({ italki_fee: 0 });
          setCheck(false);
          update();
        });
      })
      .catch((err) => message.error(err?.error?.msg));
    }
  };
  return (
    <>
      <Modal
        visible={visible}
        title={
          key === "3" ? "Cash Paid" : `Cash Paid For ${keys.length} Withdrawals`
        }
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setVisible(false);
          form.setFieldsValue({ italki_fee: 0 });
          setCheck(false);
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onOk}
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          initialValues={{
            italki_fee: 0,
          }}
        >
          <Form.Item name="italki_fee" label="Italki Fee">
            <Input />
          </Form.Item>
        </Form>
        <Checkbox
          onChange={(e) => {
            setCheck(e.target.checked);
            form.setFieldsValue({ italki_fee: e.target.checked ? 10 : 0 });
          }}
        />{" "}
        Immediate Payment
      </Modal>
      <WriteLog
        title={
          key === "3" ? "Cash Paid" : `Cash Paid For ${keys.length} Withdrawals`
        }
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default CashPaid;

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { edit_purchase_or_expandable_list } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";

const { Option } = Select;
const Refund = forwardRef((props, ref) => {
  const { curItem, update } = props;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [type, setType] = useState(null);

  useImperativeHandle(ref, () => ({
    open: (type, item) => {
      setVisible(true);
      setType(type);
      type === 'refund' && form.setFieldsValue({itc: Number(commonFilter('centToUsd', item.amount)).toFixed()})
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const submit = (log_note) => {
    const { adjust_status, itc, fee} = formValues
    let postData = {
      log_note,
      operate: type === 'edit' ? 'set_adjust_status' : "refund",
      user_id: curItem.user_id,
      adjust_status: adjust_status,
    };
    if(type === 'refund') {
      postData = {
        ...postData,
        itc: itc * 100,
        fee: fee * 100,
        order_id: curItem.order_id,
      }
    }

    edit_purchase_or_expandable_list(postData, "post", curItem.order_id)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        setVisible(false);
        update();
        form.resetFields()
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <>
      <Modal
        visible={visible}
        title={`${type === "edit" ? "Edit Tag" : "Purchase Succeed"} (${
          curItem.order_id
        })`}
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setVisible(false);
          form.resetFields()
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          layout={type === 'edit' && 'vertical'}
          form={form}
          onFinish={onOk}
          wrapperCol={{ span: type === 'edit' ? 24 : 16 }}
          labelCol={{ span: type === 'edit' ? 24 : 8 }}
        >
          {type === "edit" ? null : (
            <>
              <Form.Item name="itc" label="Refund Amount ($)">
                <Input />
              </Form.Item>

              <Form.Item initialValue={0} name="fee" label="Refund Fee ($)">
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item initialValue={0} name="adjust_status" label="Order Tag">
            <Select>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Option key={item} value={item}>
                  {commonFilter("orderTag", item)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <WriteLog
        title={type === "edit" ? "Edit Order Tag" : "Purchase Credits Refund"}
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default Refund;

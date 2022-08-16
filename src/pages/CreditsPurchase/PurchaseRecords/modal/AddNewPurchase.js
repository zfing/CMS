import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Row, Col, Form, Input, message, Select } from "antd";
import { NOT_PAY_METHODS } from "../../../../components/CommonComponent/CommonConst";
import Filter from "../../../../components/Filter";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { get_list_log_submit, edit_purchase_or_expandable_list } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";

const { Option } = Select;

const AddNewPurchase = forwardRef((props, ref) => {
  const {curItem, update} = props
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [curType, setCurType] = useState('add');

  useImperativeHandle(ref, () => ({
    open: (type) => {
      setVisible(true);
      setCurType(type);
      form.resetFields();
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const submit = (log_note) => {
    let postData = {
      ...formValues,
      // service_charge:0,
      log_note,
    };
    postData.itc = formValues.itc * 100;
    postData.currency_amount = formValues.currency_amount * 100;
    postData.real_used_amount = formValues.real_used_amount * 100;

    let api = get_list_log_submit;
    if(curType === 'edit') {
      api = edit_purchase_or_expandable_list;
      Reflect.set(postData, 'operate', 'set_succ')
      Reflect.set(postData, 'order_status', curItem.status)
    }
    api(postData, "post", curType === 'edit' ? curItem.order_id : null)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        setVisible(false);
        update();
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <>
      <Modal
        visible={visible}
        title={
          curType === "add"
            ? "Add New Purchase"
            : `Purchase Succeed (${curItem.order_id})`
        }
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setVisible(false);
          setCurType({type: 'add'})
          form.resetFields();
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        width="50%"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onOk}
          initialValues={{
            channel_type: 1,
            device_type: 0,
          }}
        >
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item
                initialValue={curType === "add"
                ? JSON.parse(localStorage.getItem("paymentConfig"))[0].pay_type
                : curItem.pay_type}
                name="pay_type"
                label="Payment Method"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Select
                  disabled={curType === "edit"}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  showSearch
                  placeholder={"Choose"}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {JSON.parse(localStorage.getItem("paymentConfig")).map(
                    (item) =>
                      !NOT_PAY_METHODS.includes(item.pay_type) && (
                        <Option value={item.pay_type} key={item.pay_type}>
                          {item.name}
                        </Option>
                      )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                name="user"
                initialValue={curType === "edit" ? curItem.user_id : null}
                label="Purchase User"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input
                  disabled={curType === "edit"}
                  placeholder="User ID / Email"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                initialValue={curType === "edit"
                ? Number(curItem.currency_rate).toFixed(2)
                : "1.00"}
                name="currency_rate"
                label="Currency Rate"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                name="itc"
                initialValue={curType === "edit" ? commonFilter('centToUsd', curItem.amount) : null}
                label="Purchase Credits Amount (USD)"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="real_used_amount"
                initialValue={curType === "edit" ? commonFilter('centToUsd', curItem.real_used_amount) : null}
                label="Real Used Amount ($)"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                initialValue={curType === 'edit' ? curItem.used_currency : "USD"}
                name="currency"
                label="Currency"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency_amount"
                initialValue={curType === "edit" ? commonFilter('centToUsd', curItem.currency_amount) : null}
                label="Currency Amount (USD)"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {curType === "add" && (
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Form.Item
                  name="channel_type"
                  label="Channel Type"
                  rules={[{ required: true, message: "can't be empty" }]}
                >
                  <Select>
                    {[1, 2].map((item) => (
                      <Option key={item} value={item}>
                        {Filter("channelType", item)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="device_type"
                  label="Device Type"
                  rules={[{ required: true, message: "can't be empty" }]}
                >
                  <Select>
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                      <Option key={item} value={item}>
                        {Filter("deviceType", item)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                name="third_order_id"
                label="Third Order ID"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="voucher_code" label="Voucher Code (optional)">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item
                name="third_value"
                label="Third Return Value (optional)"
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <WriteLog
        title={curType === 'add' ? "Add New Purchase" : 'Create purchase'}
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default AddNewPurchase;

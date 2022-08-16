import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { vtPaymentSuppliers } from "../../../../components/CommonComponent/CommonFunction";
import { add_payment_or_detail } from "../service";

const PaymentMethed = forwardRef((props, ref) => {
  const { update, type, curItem } = props;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [isIn, setIsin] = useState(false);
  const [formValues, setFormValues] = useState({});

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      if (type === "add") {
        form.resetFields();
      } else {
        form.setFieldsValue({
          code: curItem.code,
          name: curItem.name,
          commission: curItem.commission,
          base_fee: curItem.base_fee,
          default_sort: curItem.default_sort,
        });
      }
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const submit = (log_note) => {
    let postData = {
      log_note,
    };
    if (type === "edit") {
      postData = {
        operate: "edit_pay_type",
        code: formValues.code,
      };
    } else {
      postData = {
        ...formValues,
        operate: "add_pay_type",
      };
      if (!formValues.code) {
        postData.code = "emptyStr";
      }
    }

    add_payment_or_detail(
      postData,
      "post",
      type === "edit" ? curItem.pay_type : formValues.payment_methed
    )
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
  const checkData = (v) => {
    const value = v.target.value;
    let payIds = [];
    JSON.parse(localStorage.getItem("paymentConfig")).map((item) =>
      payIds.push(item.pay_type)
    );
    if (payIds.includes(Number(value)) && value !== "") {
      setIsin(true);
    } else {
      setIsin(false);
    }
  };
  return (
    <>
      <Modal
        visible={visible}
        title={
          type === "edit" ? "Edit Payment Methed" : "Add a New Payment Methed"
        }
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setIsin(false);
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        width="50%"
      >
        <Form layout="vertical" form={form} onFinish={onOk}>
          {type === "add" && (
            <>
              <Form.Item
                name="provider_id"
                label="Provider"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  showSearch
                  placeholder={"Choose"}
                  options={vtPaymentSuppliers(
                    JSON.parse(localStorage.getItem("payment_suppliers")),
                    "lv"
                  )}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Form.Item>
              {/* 唯一值, 不能重复, 输入后重复提醒 加限制只能输入正整数和0 */}
              <Form.Item
                name="payment_methed"
                label="Payment Methed ID"
                rules={[{ required: true, message: "can't be empty" }]}
              >
                <Input
                  onKeyUp={(e) => {
                    if (e?.target?.value) {
                      e.target.value = e.target.value.replace(/[^0-9]+/g, "");
                    }
                  }}
                  onChange={checkData}
                />
              </Form.Item>
            </>
          )}
          {isIn ? (
            <div className="color-red" style={{ marginTop: -15 }}>
              Sorry, this ID already exist.
            </div>
          ) : null}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Translation Code"
            rules={[
              { required: type === "edit" && true, message: "can't be empty" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="commission"
            label="Commission Fee"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="base_fee"
            label="Base Fee"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="default_sort"
            label="Defulat Sort ID"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <WriteLog
        title={
          type === "edit"
            ? `Edit Payment Methed ( ID : ${curItem.pay_type} )`
            : `Add a New Payment Methed ( ID : ${formValues.payment_methed} )`
        }
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default PaymentMethed;

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Select, Button, Form, Input, message, Spin } from "antd";
import _ from "lodash";
import {
  commonFilter,
  deleteEmptyObj,
} from "../../../../components/CommonComponent/CommonFunction";
import { recognition } from "../../../../components/CommonComponent/CommonConst";
import { get_recognitions_List, get_available_itc } from "../service";
import WriteLog from "../../../../components/CommonComponent/WriteLog";

const AddRecognition = forwardRef((props, ref) => {
  const [subAccountId, setSubAccountId] = useState(0);
  const [visible, setVisible] = useState(false);
  const [availableItc, setAvailableItc] = useState(null);
  const [credit, setCredit] = useState(null);
  const [logModal, setLogModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));

  const cancel = () => {
    setVisible(false);
    form.resetFields();
    setCredit(null);
    setAvailableItc(null);
  };
  //添加
  const submit = async (log_note) => {
    const postData = {
      account_id: subAccountId,
      amount: credit * 100,
      log_note,
    };
    get_recognitions_List(deleteEmptyObj(postData), "post")
      .then((res) => {
        logModal.onCancel();
        const {
          data: { data },
        } = res;
        if (data.success) {
          message.success("success");
          cancel();
          props.fresh();
        }
      })
      .catch((err) => {
        message.error(err?.error?.msg);
      });
  };
  const selectChange = (value) => {
    setSubAccountId(value);
    setLoading(true);
    value !== 0 &&
      get_available_itc(value)
        .then((res) => {
          const {
            data: { data },
          } = res;
          setAvailableItc(data);
          setLoading(false);
        })
        .catch((err) => message.error(err?.error?.msg));
  };
  const getTips = () => {
    const item = recognition?.find((sub) => subAccountId === sub.id);
    return `Revenue Recognition $${credit} from (${item?.id}) ${item?.name}`;
  };
  return (
    <>
      <Modal
        title="GP/Revenue Recognition"
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onCancel={cancel}
        footer={[
          <Button key="1" onClick={cancel}>
            Cancle
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={form.submit}
            disabled={
              !credit ||
              !subAccountId ||
              !availableItc ||
              credit > commonFilter("centToUsd", availableItc)
            }
          >
            Confirm
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={() => logModal.onShow()}
        >
          <Form.Item
            name="account_id"
            label="Sub Account"
            initialValue={0}
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Select
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={selectChange}
            >
              <Select.Option value={0} key="0">
                Choose
              </Select.Option>
              {recognition?.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {`(${item.id}) ${item.name}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {subAccountId !== 0 && (
            <Spin spinning={loading}>
              {availableItc !== null ? (
                <p className="text-bold-7 margin-t--24">
                  Account Balance to be recognized: $
                  {commonFilter("centToUsd", availableItc)}
                </p>
              ) : null}
            </Spin>
          )}
          <Form.Item
            name="amount"
            label="Credit (USD)"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input
              autoComplete="off"
              onChange={_.debounce(
                (e) => setCredit(Number(e.target.value)),
                500,
                {
                  trailing: true,
                }
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
      <WriteLog
        title="GP/Revenue Recognition"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
        tips={getTips()}
      />
    </>
  );
});
export default AddRecognition;

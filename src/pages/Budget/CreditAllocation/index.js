import React, { useState, useRef } from "react";
import { Button, Modal, Form, Input, message, Select, Spin } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import _ from "lodash";
import DataTable from "./Table";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { allocate_credits, get_allocations_List } from "./service";
import { subAccountsArr_100 } from "../../../components/CommonComponent/CommonConst";

const CreditAllocation = () => {
  const [moreFilter, setMoreFilter] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [credit, setCredit] = useState(0);
  const [subAccountId, setSubAccountId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [freshList, setFreshList] = useState(false);
  const childTable = useRef(null);
  const [form] = Form.useForm();

  const addAllocateCredit = () => {
    setVisible(true);
    setBalanceVisible(true)
    allocate_credits()
      .then((res) => {
        const {
          data: { data },
        } = res;
        setBalance(data);
      })
      .catch((err) => message.error(err?.error?.msg))
      .finally(_ => setBalanceVisible(false))
  };
  const operations = (
    <div className="color-white search-bar">
      <div className="float-right display-flex">
        <Button
          type="default"
          className={`${
            moreFilter === true ? "more-filter-button" : ""
          } blue margin-10-10-0-0`}
          icon={<FilterOutlined />}
          onClick={() => setMoreFilter((moreFilter) => !moreFilter)}
        >
          More Filter
        </Button>
        {HasPermi(1005301) && (
          <Button
            className="blue margin-10-10-0-0"
            onClick={addAllocateCredit}
          >
            Allocate Credits
          </Button>
        )}
      </div>
    </div>
  );
  const submit = (log_note) => {
    const postData = {
      operate: 'credit_allocate',
      trans_amount: parseInt(Number(credit)) * 100,
      log_note,
      account_id: subAccountId
    }
    get_allocations_List(postData, 'post')
    .then(res => {
      const {data: {data: success}} = res
      success && message.success('Success')
      logModal.onCancel()
      setFreshList(!freshList)
      cancel()
    })
    .catch(err => message.error(err?.error?.msg))
  };
  const cancel = () => {
    setVisible(false);
    form.resetFields();
    setCredit(0);
    setSubAccountId(0);
  };
  const getTips = () => {
    const item = subAccountsArr_100?.find((sub) => subAccountId === sub.id);
    return `Allocate Credits $${credit} to (${item?.id}) ${item?.name}`;
  };
  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      <DataTable fresh={freshList} ref={childTable} filterShow={moreFilter} />
      <Modal
        title="Allocate Credits"
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
              credit > commonFilter("centToUsd", balance) ||
              commonFilter("centToUsd", balance) < 0
            }
          >
            Confirm
          </Button>,
        ]}
      >
        <Spin spinning={balanceVisible}>
          <p className="text-bold-7">
            GBA Balance: ${commonFilter("centToUsd", balance)}
          </p>
        </Spin>
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={() => logModal.onShow()}
        >
          <Form.Item
            name="trans_amount"
            label="Credit (USD)"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input
              placeholder=""
              onChange={_.debounce(
                (e) => setCredit(Number(e.target.value)),
                500,
                {
                  trailing: true,
                }
              )}
            />
          </Form.Item>
          <Form.Item
            name="account_id"
            label="to"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Select
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={(value) => setSubAccountId(value)}
              defaultValue={0}
            >
              <Select.Option value={0} key="0">
                Choose
              </Select.Option>
              {subAccountsArr_100?.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {`(${item.id}) ${item.name}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        {credit && credit > commonFilter("centToUsd", balance) ? (
          <p className="color-red">
            The GBA balance is insufficient. Please add funds first.
          </p>
        ) : null}
      </Modal>
      <WriteLog
        title="Allocate Credits"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
        tips={getTips()}
      />
    </div>
  );
};

export default CreditAllocation;

import React, { useState, useRef } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import _ from 'lodash'
import DataTable from "./Table";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import { gba_funding_undo } from "./service";

const GBAFunding = () => {
  const [moreFilter, setMoreFilter] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [credit, setCredit] = useState(0);
  const [freshList, setFreshList] = useState(false);
  const childTable = useRef(null);
  const [form] = Form.useForm();

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
        {HasPermi(1005201) && (
          <Button
            className="blue margin-10-10-0-0"
            onClick={() => setVisible(true)}
          >
            Add Funds
          </Button>
        )}
      </div>
    </div>
  );
  const submit = (log_note) => {
    const postData = {
      operate: 'gba_funding',
      trans_amount: parseInt(Number(credit)) * 100,
      log_note
    }
    gba_funding_undo(postData)
    .then(res => {
      const {data: {data: success}} = res
      success && message.success('Success')
      logModal.onCancel()
      setFreshList(!freshList)
      setVisible(false)
    })
    .catch(err => message.error(err?.error?.msg))
  };
  const cancel = () => {
    setVisible(false)
    form.resetFields()
  }
  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      <DataTable
        fresh={freshList}
        update={() => setFreshList(!freshList)}
        ref={childTable}
        filterShow={moreFilter}
      />
      <Modal 
        title="Add Funds" 
        visible={visible}
        maskClosable={false}
        onCancel={cancel}
        footer={[
          <Button key="1" onClick={cancel}>
            Cancle
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={form.submit}
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
            name="trans_amount"
            label="Credit (USD)"
            rules={[{ required: true, message: "can't be empty" }]}
          >
            <Input placeholder="" onChange={_.debounce(e => setCredit(e.target.value), 500, {trailing: true})} />
          </Form.Item>
        </Form>
      </Modal>
      <WriteLog
        title="GBA Funding - Add Funds"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
        tips={`Add Funds - $${credit}`}
      />
    </div>
  );
};

export default GBAFunding;

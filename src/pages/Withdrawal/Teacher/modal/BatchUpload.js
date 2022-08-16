import React, { forwardRef, useImperativeHandle, useState } from "react";
import moment from "moment";
import axios from "axios";
import qs from "qs";
import { Modal, Form, Input, Select, message, DatePicker, Button } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { commonFilter, deleteEmptyObj } from "../../../../components/CommonComponent/CommonFunction";

const { RangePicker } = DatePicker;
const BatchUpload = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});

  useImperativeHandle(ref, () => ({
    open: (key) => {
      setVisible(true);
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const submit = (log_note) => {
    const { italkiFee, withdraw_type, account_type, dateTime } = formValues;
    let postData = {
      log_note,
      operate: "upload_file_hyperwallet",
      itc_fee: commonFilter("centToUsd", italkiFee),
      min_ft: dateTime ? moment(dateTime[0]).format("YYYY-MM-DD HH:mm") : null,
      max_ft: dateTime ? moment(dateTime[1]).format("YYYY-MM-DD HH:mm") : null,
      italkiFee: italkiFee || 0,
      withdraw_type: withdraw_type || '1',
      account_type: account_type || 40,
      download_xls: 1
    };
    download(postData)
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const checkDownload = () => {
    setLoading(true)
    const { italkiFee, withdraw_type, account_type, dateTime } = formValues;
    let checkData = {
      operate: "upload_file_hyperwallet",
      itc_fee: commonFilter("centToUsd", italkiFee),
      min_ft: dateTime ? moment(dateTime[0]).format("YYYY-MM-DD HH:mm") : null,
      max_ft: dateTime ? moment(dateTime[1]).format("YYYY-MM-DD HH:mm") : null,
      italkiFee: italkiFee || 0,
      withdraw_type: withdraw_type || '1',
      account_type: account_type || 40,
      download_xls: 1
    };
    download(checkData)
  };
  const download = (data) => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/withdraw/teacher-withdrawals`,qs.stringify(deleteEmptyObj(data)),{
      'headers': {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Token": localStorage.getItem("cms.token"),
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "blob"
    })
    .then((res) => {
      const fileName = res.headers["content-disposition"];
      let downLink = document.createElement('a');
      downLink.download = fileName.substring(fileName.indexOf("filename=") + 9);
      downLink.style.display = 'none';
      let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
      downLink.href = URL.createObjectURL(blob);
      document.body.appendChild(downLink);
      downLink.click();
      document.body.removeChild(downLink);
    }) 
    .catch((err) => {
      message.error('No Data')
      logModal.onCancel()
    })
    .finally(_ => setLoading(false))
  }
  return (
    <>
      <Modal
        visible={visible}
        title="Teacher Withdrawal - Batch upload to Hyperwallet back office"
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        width="45%"
        footer={[
          <Button disabled={loading} key="1" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button disabled={loading} type="primary" onClick={form.submit} key="2">
            Confirm
          </Button>,
          <Button key="3" onClick={checkDownload}>
            Check && Download
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onOk}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            italkiFee: 0,
            account_type: 40,
            withdraw_type: "1"
          }}
        >
          <Form.Item name="account_type" label="Withdraw Method">
            <Select>
              {JSON.parse(localStorage.getItem("paymentConfig"))
                .filter((item) => [40, 41].includes(item.pay_type))
                .map((item) => (
                  <Select.Option value={item.pay_type} key={item.pay_type}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="flex-baseline"
            name="dateTime"
            label="Approved Time Range"
          >
            <RangePicker
              showTime={{
                hideDisabledOptions: false,
                defaultValue: [
                  moment("00:00", "HH:mm"),
                  moment("23:59", "HH:mm"),
                ],
              }}
              format="YYYY-MM-DD HH:mm"
              className="width-hundred-percent"
              style={{ marginTop: "5px" }}
              ranges={{
                "Last 30 Days": [moment().subtract(30, "days"), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "Last Month": [
                  moment().subtract(1, "months").startOf("month"),
                  moment().subtract(1, "months").endOf("month"),
                ],
                "This Year": [moment().startOf("year"), moment().endOf("year")],
                "Last Year": [
                  moment().subtract(1, "years").startOf("year"),
                  moment().subtract(1, "years").endOf("year"),
                ],
              }}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name="withdraw_type" label="Withdrawal Type">
            <Select>
              <Select.Option value="1" key="1">
                Not immediately
              </Select.Option>
              <Select.Option value="2" key="2">
                Immediately
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="italkiFee" label="Italki Fee(USD)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <WriteLog
        title="Teacher Withdrawal - Batch upload to Hyperwallet back office"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default BatchUpload;

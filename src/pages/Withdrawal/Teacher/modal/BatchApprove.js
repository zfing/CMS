import React, { useState, useImperativeHandle } from "react";
import {
  Modal,
  Select,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  message,
} from "antd";
import moment from "moment";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { WithdrawMethod, SameWithdrawalTimes } from "../../WithdrawalConst";
import { get_list_log_submit } from "../service";

const { RangePicker } = DatePicker;
const BatchApprove = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [flag, setFlag] = useState(false);
  const [sameWithdrawNum, setSameWithdrawNum] = useState("5");
  const [selectType, setSelectType] = useState();
  const [applicationTime, setApplicationTime] = useState({
    start_time: moment().subtract(1, "months").startOf("month"),
    end_time: moment().subtract(1, "months").endOf("month"),
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  const handleCloseDetail = () => {
    setVisible(false);
    setSameWithdrawNum("5");
    setFlag(false);
  };
  const confirm = (log_note) => {
    let postData = {
      log_note,
      account_type: selectType || "",
      same_withdraw_num: sameWithdrawNum,
      operate: "batch_accept_by_filter",
      min_ct: moment(applicationTime.start_time).format("YYYY-MM-DD"),
      max_ct: moment(applicationTime.end_time).format("YYYY-MM-DD"),
    };
    get_list_log_submit(postData, 'post')
    .then((res) => {
      const {
        data: { data: success },
      } = res;
      if (success) {
        logModal.onCancel();
        handleCloseDetail();
        message.success("Success");
        props.update();
      }
    })
    .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <Modal
      visible={visible}
      onCancel={handleCloseDetail}
      destroyOnClose
      title="Batch approve the same withdrawal"
      width={"45%"}
      maskClosable={false}
      footer={[
        <Button key="1" onClick={handleCloseDetail}>
          Cancel
        </Button>,
        <Button
          key="2"
          type="primary"
          onClick={() => logModal.onShow()}
          disabled={!sameWithdrawNum}
        >
          Comfirm
        </Button>,
      ]}
    >
      <Row
        gutter={[8, 8]}
        align="center"
        className="margin-bottom-15 display-flex-align-center"
      >
        <Col span={8} className="text-align-right">
          Withdraw Method
        </Col>
        <Col span={16}>
          <Select
            style={{ width: "100%" }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            defaultValue={""}
            onChange={(value) => {
              setSelectType(value);
            }}
          >
            <Select.Option value={""} key="-1">
              Choose
            </Select.Option>
            {JSON.parse(localStorage.getItem("paymentConfig"))
              .filter((item) => WithdrawMethod.includes(item.pay_type))
              .map((item) => (
                <Select.Option value={item.pay_type} key={item.pay_type}>
                  {item.name}
                </Select.Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        className="margin-bottom-15 display-flex-align-center"
      >
        <Col span={8} className="text-align-right">
          Same Withdrawal Times
        </Col>
        <Col span={11}>
          <Select
            defaultValue={"5"}
            className="width-hundred-percent"
            onChange={(value) => {
              setSameWithdrawNum(value);
              setFlag(false);
            }}
          >
            {SameWithdrawalTimes.map((item) => (
              <Select.Option value={item.key} key={item.key}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={5}>
          <Input
            value={sameWithdrawNum}
            onChange={(e) => {
              setSameWithdrawNum(e.target.value);
              setFlag(true);
            }}
            disabled={!flag && sameWithdrawNum}
          />
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        className="margin-bottom-15 display-flex-align-center"
      >
        <Col span={8} className="text-align-right">
          Application Time Range
        </Col>
        <Col span={16}>
          <RangePicker
            format="YYYY-MM-DD"
            defaultValue={[
              moment().subtract(1, "months").startOf("month"),
              moment().subtract(1, "months").endOf("month"),
            ]}
            onChange={(data, datastring) =>
              setApplicationTime({
                start_time: moment(datastring[0]).format("YYYY-MM-DD"),
                end_time: moment(datastring[1]).format("YYYY-MM-DD"),
              })
            }
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
        </Col>
      </Row>
      <WriteLog
        title="Batch approve the same withdrawal"
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
      />
    </Modal>
  );
});

export default BatchApprove;

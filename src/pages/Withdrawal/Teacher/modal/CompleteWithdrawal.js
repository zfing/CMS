import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  Spin,
  Form,
  Input,
  message,
  Row,
  Col,
  Checkbox,
  DatePicker,
} from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { edit_expandable_cash } from "../service";
import moment from "moment";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";

const CompleteWithdrawal = forwardRef((props, ref) => {
  const { curItem, update } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkedMass, setCheckedMass] = useState(false);
  const [checkedImmediate, setCheckedImmediate] = useState(false);
  const [data, setData] = useState({});
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [remark, setRemark] = useState("");

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  useEffect(() => {
    visible && fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const fetch = () => {
    setLoading(true);
    edit_expandable_cash(null, null, curItem.id)
      .then((res) => {
        const {
          data: { data },
        } = res;
        setData(data);
        form.setFieldsValue({
          money: commonFilter("centToUsd", data?.amount) - commonFilter(
            "centToUsd",
            data?.admindisposalwithdraw_obj?.italki_fee
          ),
          pay_date: moment(),
          user: JSON.parse(localStorage.getItem("fms.user"))?.username,
          italki_fee: commonFilter(
            "centToUsd",
            data?.admindisposalwithdraw_obj?.italki_fee
          ),
          third_fee: commonFilter(
            "centToUsd",
            data?.admindisposalwithdraw_obj?.third_fee
          ),
        });
        setCheckedMass(data?.admindisposalwithdraw_obj?.is_mass);
        setCheckedImmediate(data?.admindisposalwithdraw_obj?.is_immediate);
      })
      .catch((err) => message.error(err?.error?.msg))
      .finally((_) => setLoading(false));
  };

  const onOk = (values) => {
    setFormValues(values);
    // console.log(formValues, "formValues");
    logModal.onShow();
  };
  const submit = (log_note) => {
    const { italki_fee, third_fee, bill_id, money, currency } = formValues;
    let postData={
      operate: 'accept_done',
      log_note,
      bill_id,
      pay_method: data?.account_type,
      pay_date: moment(formValues.pay_date).format('YYYY-MM-DD HH:mm'),
      italki_fee: italki_fee * 100,
      third_fee: third_fee * 100,
      money: money * 100,
      currency,
      user_id: data?.user_id,
      pay_user: JSON.parse(localStorage.getItem("fms.user"))?.username,
      is_mass: checkedMass ? 1 : 0,
      is_immediate: checkedMass ? 1 : 0,
      remark
    }
    edit_expandable_cash(postData, 'post', curItem.id)
    .then(res => {
      const {data : {success}} = res
      success && message.success("Success");
      logModal.onCancel();
      setVisible(false);
      form.resetFields();
      update();
    })
    .catch(err => message.error(err?.error?.msg))
  };
  return (
    <>
      <Modal
        visible={visible}
        title={`Complete Withdrawal ${data?.order_id}`}
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        width="50%"
      >
        <Spin spinning={loading}>
          <Row gutter={[8, 8]} className="margin-bottom-5">
            <Col className="color-999" span={12}>
              User ID
            </Col>
            <Col className="color-999" span={12}>
              Withdrawal USD
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="margin-bottom-5">
            <Col className="text-bold" span={12}>
              {data?.user_id}
            </Col>
            <Col className="text-bold" span={12}>
              {commonFilter("centToUsd", data?.amount)}
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="margin-bottom-5">
            <Col className="color-999" span={12}>
              Withdrawal Method
            </Col>
            <Col className="color-999" span={12}>
              Withdrawal Account
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="margin-bottom-5">
            <Col className="text-bold" span={12}>
              {commonFilter("payType", data?.account_type)}
            </Col>
            <Col className="text-bold" span={12}>
              {data?.account}
            </Col>
          </Row>
          <div className="text-bold-7 margin-10-0 font-size-15">
            Input Withdrawal Information
          </div>
          <Form
            layout="vertical"
            form={form}
            onFinish={onOk}
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            initialValues={{
              currency: "USD",
            }}
          >
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Form.Item name="currency" label="Currency">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="money" label="Received money">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Form.Item
                  name="bill_id"
                  label="Bill ID"
                  rules={[{ required: true, message: "can't be empty" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="pay_date" label="Pay Date">
                  <DatePicker
                    showTime
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    format="YYYY-MM-DD HH:mm"
                    className="width-hundred-percent"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Form.Item name="user" label="Pay User">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="italki_fee" label="Italki Fee">
                  <Input
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      form.setFieldsValue({
                        money: (
                          commonFilter("centToUsd", data?.amount) - v
                        ).toFixed(2),
                      });
                    }}
                    disabled={curItem.status === 7}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="third_fee" label="Third Fee">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]} className="margin-bottom-10">
              <Col>
                <Checkbox
                  checked={checkedMass}
                  onChange={(e) => setCheckedMass(e.target.checked)}
                >
                  <span
                    className={`text-bold ${
                      checkedMass ? "checked-color" : ""
                    }`}
                  >
                    Mass Payment
                  </span>
                </Checkbox>
                <Checkbox
                  checked={checkedImmediate}
                  onChange={(e) => {
                    setCheckedImmediate(e.target.checked);
                    form.setFieldsValue({
                      italki_fee: e.target.checked ? 10 : 0,
                      money: e.target.checked
                        ? commonFilter("centToUsd", data?.amount) - 10
                        : commonFilter("centToUsd", data?.amount),
                    });
                  }}
                  disabled={curItem.status === 7}
                >
                  <span
                    className={`text-bold ${
                      checkedImmediate ? "checked-color" : ""
                    }`}
                  >
                    Immediate Payment
                  </span>
                </Checkbox>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col span={24}>Remark</Col>
              <Col span={24}>
                <Input.TextArea
                  onChange={(e) => setRemark(e.target.value)}
                  row={5}
                />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <WriteLog
        title="Complete Withdrawal"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default CompleteWithdrawal;

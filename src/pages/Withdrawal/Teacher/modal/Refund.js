import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Modal, Spin, Form, Input, message, notification } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { edit_expandable_cash } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
const Refund = forwardRef((props, ref) => {
  const {
    curItem: { id },
    update,
  } = props;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [curData, setCurData] = useState({});
  const [changeItc, setChangeItc] = useState(0);
  const [changeFee, setChangeFee] = useState(0);

  useEffect(() => {
    visible && fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id]);
  const fetch = () => {
    setLoading(true);
    edit_expandable_cash(null, null, id)
      .then((res) => {
        const {
          data: { data },
        } = res;
        setCurData(data);
        form.setFieldsValue({
          itc: commonFilter("centToUsd", data?.amount),
          italki_fee: commonFilter(
            "centToUsd",
            data?.admindisposalwithdraw_obj?.italki_fee
          ),
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Can not get data",
        });
      })
      .finally((_) => setLoading(false));
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  const onOk = (values) => {
    setFormValues(values);
    logModal.onShow();
  };
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
    setChangeItc(0);
    setChangeFee(0);
  };
  const submit = (log_note) => {
    const { itc, italki_fee } = formValues;
    const postData = {
      log_note,
      operate: "accept_done_cancel",
      itc: itc * 100,
      italki_fee: italki_fee * 100,
    };

    edit_expandable_cash(postData, 'post', id)
      .then((res) => {
        const {
          data: { data: success }
        } = res;
        success && message.success("Success");
        onCancel()
        logModal.onCancel();
        update();
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <>
      <Modal
        visible={visible}
        title="Cash Refund Withdrawal"
        cancelText="Cancel"
        okText="Submit"
        onCancel={onCancel}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        okButtonProps={{
          disabled:
            Number(changeFee) >
              commonFilter(
                "centToUsd",
                curData?.admindisposalwithdraw_obj?.italki_fee
              ) ||
            Number(changeItc) > commonFilter("centToUsd", curData?.amount),
        }}
      >
        <Spin spinning={loading}>
          <Form
            layout="vertical"
            form={form}
            onFinish={onOk}
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
          >
            <Form.Item name="itc" label="ITC">
              <Input onChange={(e) => setChangeItc(e.target.value)} />
            </Form.Item>

            <Form.Item name="italki_fee" label="Italki Fee">
              <Input
                onChange={(e) => setChangeFee(e.target.value)}
                disabled={curData?.admindisposalwithdraw_obj?.italki_fee === 0}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <WriteLog
        title="Cash Refund"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default Refund;

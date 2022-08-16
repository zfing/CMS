import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Col, Row, message, Input, Select } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { arrayOptions } from "../../../../components/CommonComponent/CommonFunction";
import { add_payment_or_detail } from "../service";

const AddEditSort = forwardRef((props, ref) => {
  const { update, curItem } = props;

  const [visible, setVisible] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [selectCountry, setSelectCountry] = useState(null);
  const [sordId, setSordId] = useState(null);
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));
  const submit = (log) => {
    let postData = {
      log_note: log,
      operate: "add_country_sort",
      sort_id: sordId,
      country: selectCountry,
    };

    add_payment_or_detail(postData, "post", curItem.pay_type)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        update();
        setVisible(false);
        cancel()
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const cancel = () => {
    setVisible(false);
    setSelectCountry(null);
    setSordId(null);
  };
  return (
    <>
      <Modal
        title="Add Sort"
        visible={visible}
        onCancel={cancel}
        onOk={() => logModal.onShow()}
        okText="Confirm"
        cancelText="Close"
        zIndex={2}
        destroyOnClose
        okButtonProps={{
          disabled: !sordId || !selectCountry,
        }}
      >
        <Row>
          <Col span={24}>Countries</Col>
          <Col span={24}>
            <Select
              className="width-hundred-percent"
              placeholder="Choose"
              showSearch
              options={arrayOptions(
                JSON.parse(localStorage.getItem("countryCodeList"))
              )}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v) => setSelectCountry(v)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>Sort ID</Col>
          <Col span={24}>
            <Input onChange={(e) => setSordId(e.target.value)} />
          </Col>
        </Row>
      </Modal>
      <WriteLog
        title="Add Sort"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default AddEditSort;

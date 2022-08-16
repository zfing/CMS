import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Col, Row, message, Select } from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { UsingStatus } from "../../CredistsConst";
import { arrayOptions } from "../../../../components/CommonComponent/CommonFunction";
import { add_payment_or_detail } from "../service";

const { Option } = Select;

const StatusCountry = forwardRef((props, ref) => {
  const { update, curItem } = props;
  const [visible, setVisible] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [selectCountries, setSelectCountries] = useState([]);
  const [changeStatus, setChangeStatus] = useState("1");
  const [title, setTitle] = useState(null);

  useImperativeHandle(ref, () => ({
    open: (title) => {
      setVisible(true);
      setTitle(title === 1 && 'Edit Using Status & Country');
      if (title && curItem?.country_s.length > 0) {
        setChangeStatus(String(curItem?.country_s[0]?.status));
        setSelectCountries(defaultCountry(curItem.country_s));
      }
    },
    close: () => {
      setVisible(false);
    },
  }));
  const defaultCountry = (countries) => {
    let country_s = [];
    countries?.map((item) => country_s.push(item.country));
    return country_s;
  };
  const submit = (log) => {
    let formData = new FormData();
    let postData = {
      log_note: log,
      operate: "change_pay_type_status",
      status: changeStatus,
    };
    Reflect.ownKeys(postData).map((key) => formData.append(key, postData[key]));
    changeStatus !== "1" && selectCountries?.map((item) => formData.append("countries", item));
    add_payment_or_detail(formData, "post", curItem.pay_type, {
      dataType: "form"
    })
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        update();
        setVisible(false);
        setSelectCountries([]);
        setChangeStatus("1");
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const valueTag = () => {
    if (title && curItem?.country_s?.length > 0) {
      return defaultCountry(curItem.country_s);
    }
  };

  return (
    <>
      <Modal
        title={title ? title : "Enable"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          !title && setSelectCountries([]);
          setChangeStatus("1");
        }}
        onOk={() => logModal.onShow()}
        okText="Confirm"
        cancelText="Close"
        zIndex={2}
        destroyOnClose={title === 1 ? false : true}
        okButtonProps={{
          disabled: changeStatus !== "1" && selectCountries.length === 0,
        }}
      >
        <Row>
          <Col span={24}>Use Status</Col>
          <Col span={24}>
            <Select
              className="width-hundred-percent"
              defaultValue={
                curItem?.country_s?.length > 0
                  ? String(curItem?.country_s[0]?.status)
                  : "1"
              }
              onChange={(v) => {
                setChangeStatus(v);
                if( title && v === String(curItem?.country_s[0]?.status)) {
                  setSelectCountries(defaultCountry(curItem.country_s))
                } else {
                  setSelectCountries([])
                }
              }}
            >
              {UsingStatus.filter((item) =>
                ["1", "2", "3"].includes(item.v)
              ).map((i) => (
                <Option value={i.v} key={i.v}>
                  {i.t}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {['2','3'].includes(changeStatus) && <Row>
          <Col span={24}>Countries</Col>
          <Col span={24}>
            <Select
              className="width-hundred-percent"
              mode="multiple"
              defaultValue={title && valueTag}
              value={selectCountries}
              placeholder="Choose"
              showSearch
              options={arrayOptions(
                JSON.parse(localStorage.getItem("countryCodeList"))
              )}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v) => setSelectCountries(v)}
            />
          </Col>
        </Row>}
      </Modal>
     
      <WriteLog
        title={title ? title : "Enable"}
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default StatusCountry;

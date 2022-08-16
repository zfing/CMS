import React, { useState, useRef, useImperativeHandle } from "react";
import { Modal, InputNumber, Row, Col, message } from "antd";
import api from "../../../../components/Api";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
const FrozenPart = React.forwardRef((props, ref) => {
  const {maxValue, curKey, curId, fresh} = props
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [logModal, setLogModal] = useState(false);
  const [activeKey, setActiveKey] = useState(curKey);
  const value = useRef();

  useImperativeHandle(ref, () => ({
    open: (title, key) => {
      setVisible(true);
      setActiveKey(key);
      setModalTitle(title);
    },
  }));
  const handleCloseDetail = () => {
    setVisible(false);
  };
  const walletPrePartHandle = () => {
    if (value?.current?.value) {
      logModal.onShow();
    } else {
      message.warning("Input value can't be empty");
    }
  };
  const confirmFrozen = async (log_note) => {
    let postData = {log_note, itc: Number(value?.current?.value) * 100}
    switch (activeKey) {
      case '1':
        Reflect.set(postData, 'operate', 'frozen_sv_part')
        break;
      case '2':
        Reflect.set(postData, 'operate', 'frozen_tv_part')
        break;
      default:
        return null;
    }
    api.post(`/wallet/user/${curId}`, postData)
    .then(res => {
      const {data:{data:{success}}} = res
      if(success) {
        message.success('Success')
        logModal.onCancel()
        setVisible(false)
        fresh()
      }
    })
    .catch(err => message.error(err?.error?.msg))
  };
  return (
    <>
      <Modal
        title={modalTitle}
        visible={visible}
        onCancel={handleCloseDetail}
        onOk={walletPrePartHandle}
        okText="Confirm"
        destroyOnClose
      >
        <Row gutter={[24, 12]}>
          <Col span={24}>Input the value</Col>
          <Col span={24}>
            {" "}
            <InputNumber
              className="width-100p"
              min={0.1}
              defaultValue={commonFilter('centToUsd', maxValue)}
              max={commonFilter('centToUsd', maxValue)}
              ref={value}
            />
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            Amount: Min $0.1, Max ${commonFilter('centToUsd', maxValue)}
          </Col>
        </Row>
      </Modal>
      <WriteLog
        title={modalTitle}
        onRef={(ref) => setLogModal(ref)}
        onOk={confirmFrozen}
      />
    </>
  );
});

export default FrozenPart;

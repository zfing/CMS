import React, { useRef, useState } from "react";
import { Modal, Row, Col, Select, InputNumber, Button, message } from "antd";
const EditGeneration = (props) => {
  const { visible, title, tip, options = [], onCancel, onData } = props;
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(null);
  const countRef = useRef(null);
  const handleConfirm = () => {
    if (count) {
      onData({ count: count });
      onCancel()
    } else {
      const { value } = countRef.current.state;
      if (!value) {
        message.warning("The customize value can't be null")
        return
      }
      onData({ count: value });
      onCancel()
    }
    setCount(null)
    setShow(true)
  }
  const handleCancel = () => {
    setShow(true)
    onCancel()
  }
  return (
    <Modal
      title={title}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={handleCancel}
      footer={[<Button key='1' onClick={handleCancel}>Cancel</Button>,
              <Button key='2' type='primary' onClick={handleConfirm}>Confirm</Button>]}
    >
      <h4>{tip}</h4>
      <Row gutter={[24, 24]}>
        <Col span={show ? 12 : 24}>
          <Select
            getPopupContainer={ triggerNode => triggerNode.parentNode}
            defaultValue=""
            className="width-hundred-percent"
            options={options}
            onChange={(v) => {
              !v ? setShow(true) : setShow(false);
              setCount(parseInt(v));
            }}
          />
        </Col>
        {show && (
          <Col span={12}>
            <InputNumber
              className="width-hundred-percent"
              precision={0}
              defaultValue=''
              ref={countRef}
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default EditGeneration;

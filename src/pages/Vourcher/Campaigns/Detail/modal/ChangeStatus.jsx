import React, { useState, useEffect } from "react";
import { Modal, Select, Button } from "antd";
const ChangeStatus = (props) => {
  const { visible, tip, type, options = [], onCancel, onData, defaultValue, log } = props;
  const flag = type === 'campaigns'
  const [status, setStatus] = useState(defaultValue);
  useEffect(() => {
    if(log) {
      setStatus(defaultValue)
    }
  }, [defaultValue, log])
  
  return (
    <Modal
      title={flag ? "Change Campaign Status" : "Change Generic Coupon Status"}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      footer={[
        <Button key='1' onClick={() => {
          onCancel()
          setStatus(defaultValue)
        }}>Cancle</Button>,
        <Button key='2' type='primary' disabled={!status || status === defaultValue} 
          onClick={() => {
          onData({
            status,
          })
          onCancel()
        }}>Confirm</Button>
      ]}
      onCancel={onCancel}
    >
      <h4>{tip}</h4>
      <Select
        defaultValue={defaultValue}
        options={options}
        className="width-hundred-percent"
        onChange={(v) => {
          setStatus(v)
        }}
      />
    </Modal>
  );
};

export default ChangeStatus;

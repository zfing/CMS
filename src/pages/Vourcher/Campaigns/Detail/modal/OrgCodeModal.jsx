import React from "react";
import { Modal, Button } from "antd";
const OrgCodeView = (props) => {
  const { item, onCancel, title } = props;
  return (
    <Modal
      title={title}
      visible={item.visible}
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      footer={[<Button key='1' onClick={onCancel}>Close</Button>]}
    >
      {
        item?.code?.length > 0 && item.code.map(i => <div key={i}>{i}</div>)
      }
    </Modal>
  );
};

export default OrgCodeView;

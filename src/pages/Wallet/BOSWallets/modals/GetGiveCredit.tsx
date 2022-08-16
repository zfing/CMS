import React, { memo } from "react";
import { Modal, Form, Input, Select } from "antd";
import { Regional, GetSelectList, GiveSelectList } from "../../WalletConst";
const GetGiveCredit: React.FC<{}> = (props) => {
  const { title, type, onMessage, onCancel, visible, curItem: { id } } = props as any;
  const [form] = Form.useForm();
  const SelectList = type === 'get' ? GetSelectList : GiveSelectList;
  const handleCancel = () => {
    onCancel()
  }
  return (
    <Modal
      title={title + id}
      visible={visible}
      okText="Confirm"
      cancelText='Close'
      width='40%'
      destroyOnClose
      onCancel={handleCancel}
      maskClosable={false}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onFinish={(v) => {
          const data = {
            channel_type: v.channel_type,
            show_type: v.show_type,
            itc: Number(v.itc) * 100
          }
          onMessage(data)
        }}
        initialValues={{
          show_type: '',
          channel_type: 1
        }}
      >
        <Form.Item
          name="show_type"
          label={`Select a reason for ${type === 'get' ? 'Charge Fee' : 'credits to the BOS'}`}
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <Select.Option key="-1" value="">
              Choose
            </Select.Option>
            {SelectList.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="itc"
          label="USD ($)"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        {type === 'give' && <Form.Item
          name="channel_type"
          label="Regional"
          rules={[{ required: true, message: "can't be empty" }]}
        >
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {Regional.map((item) => (
              <Select.Option key={item.t} value={item.v}>
                {item.t}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>}
      </Form>
    </Modal>
  );
};

export default memo(GetGiveCredit);
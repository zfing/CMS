// js
// import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Row,
//   Select,
//   notification,
//   message,
//   Spin,
//   Button,
// } from "antd";
// import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
// import { get_members_list, get_members_available_itc } from "../service";
// const BOSCredit = React.forwardRef((props, ref) => {
//   const { onData, curItem } = props;
//   const [loading, setLoading] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [viewItc, setViewItc] = useState(false);
//   const [members, setMembers] = useState([]);
//   const [availableItc, setAvailableItc] = useState(null);
//   const [type, setType] = useState({ title: "", key: "" });
//   const [form] = Form.useForm();
//   const textAreaRef = useRef(null);

//   useEffect(() => {
//     visible &&
//       get_members_list(curItem.id)
//         .then((res) => {
//           setMembers(res?.data?.data);
//         })
//         .catch((err) => {
//           notification.error({
//             message: "Error",
//             description: "Can't get member data",
//           });
//         });
//   }, [curItem.id, visible]);

//   const handleOnCancel = () => {
//     setVisible(false);
//     form.resetFields();
//     setAvailableItc(null);
//     setViewItc(false);
//   };
//   const tailLayout = {
//     wrapperCol: { span: 24 },
//     style: {
//       margin: "20px 0 -20px",
//       padding: "20px 0",
//       borderTop: "1px #f0f0f0 solid",
//     },
//   };
//   useImperativeHandle(ref, () => ({
//     open: (title, key) => {
//       setVisible(true);
//       setType({ title, key });
//     },
//     cancel: () => handleOnCancel(),
//   }));
//   const onFinish = (values) => {
//     const { actions, itc, members } = values;

//     // onData(
//     //   {
//     //     ...params,
//     //   }
//     // );
//   };
//   const selectMember = (v) => {
//     if (v) {
//       setViewItc(true);
//       setLoading(true);
//       get_members_available_itc(v)
//         .then((res) => setAvailableItc(res?.data?.data))
//         .catch((err) => {
//           notification.error({
//             message: "Error",
//             description: "Can't get available itc",
//           });
//         })
//         .finally((_) => setLoading(false));
//     } else {
//       setViewItc(false);
//       setAvailableItc(null);
//     }
//   };
//   return (
//     <Modal
//       title={type.title}
//       visible={visible}
//       destroyOnClose
//       maskClosable={false}
//       onCancel={handleOnCancel}
//       width="60%"
//       footer={null}
//     >
//       <Form
//         form={form}
//         colon={false}
//         labelCol={{ span: 8 }}
//         wrapperCol={{ span: 16 }}
//         onFinish={onFinish}
//         initialValues={{
//           action: "-1",
//           members: "",
//         }}
//       >
//         <Form.Item label="BOS ID">{curItem.id}</Form.Item>
//         <Form.Item label="BOS Name">{curItem.display_name}</Form.Item>
//         <Form.Item label="BOS Unallocated Balance">
//           ${commonFilter("centToUsd", curItem.sv)} USD
//         </Form.Item>
//         <Form.Item
//           label="Action"
//           name="action"
//           rules={[{ required: true, message: "can't be empty" }]}
//         >
//           <Select>
//             <Select.Option key="-1" value="-1">
//               Add credits from BOS Wallet
//             </Select.Option>
//             <Select.Option key="1" value="1">
//               Transfer credits to BOS Wallet
//             </Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item label="Members" name="members">
//           <Select onChange={selectMember}>
//             <Select.Option key="-1" value="">
//               Choose
//             </Select.Option>
//             {members.length > 0 &&
//               members.map((item, index) => (
//                 <Select.Option key={item + index} value={item}>
//                   {item}
//                 </Select.Option>
//               ))}
//           </Select>
//         </Form.Item>

//         {viewItc && (
//           <Form.Item label=" ">
//             <Spin spinning={loading}>
//               Available Itc: &nbsp;
//               <span className="text-bold">
//                 {availableItc !== null && `$${commonFilter("centToUsd", availableItc)} USD`}
//               </span>
//             </Spin>
//           </Form.Item>
//         )}

//         <Form.Item
//           name="itc"
//           label="Adjust Value(USD)"
//           rules={[{ required: true, message: "can't be empty" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item {...tailLayout}>
//           <Row justify="end">
//             <Button onClick={handleOnCancel} className="margin-right-10">
//               {" "}
//               Close{" "}
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {" "}
//               Confirm{" "}
//             </Button>
//           </Row>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// });

// export default BOSCredit;
// ts
import React, { memo, useState, useEffect, useMemo } from "react";
import { Modal, Row, Col, Spin, Select, InputNumber } from "antd";
import { multiply } from "../../../../Untils/untils";
import { get_members_list, get_members_available_itc } from "../service";
interface member {
  nickname: string,
  id: number
}
const BOSCredit: React.FC<{}> = (props) => {
  const { onMessage, onCancel, visible, curItem: { id, display_name, sv } } = props as any;
  const [action, setAction] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<number | string>(0);
  const [value, setValue] = useState<number>(0);
  const [members, setMembers] = useState<[]>([]);
  const [canUseItc, setCanUseItc] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const isOk: boolean = useMemo((): boolean => {
    if (user && value && action && value <= multiply(action === -1 ? sv : canUseItc, 0.01)) {
      return true;
    } return false;
  }, [user, value, action, canUseItc, sv]);

  useEffect(() => {
    const getMember = async (id: number = 0) => {
      const { data: { data } }: any = await get_members_list({ fetch_name: 'members_simple_data' }, null, id);
      if (data.length > 0) {
        setMembers(data);
      }
    };
    id && getMember(id);
    if (!visible) {
      setShow(false)
      setCanUseItc(0)
    }
  }, [id, visible]);
  const changeUser = async (v: number) => {
    setLoading(true)
    setShow(true)
    if (v !== -1) {
      setUser(v);
      const { data: { data } }: any = await get_members_available_itc(v);
      setCanUseItc(data);
      setLoading(false)
    } else {
      setShow(false);
      setUser(0)
    }
  };
  const handleCancel = () => {
    onCancel()
    setShow(false)
    setCanUseItc(0)
    setUser(0)
  }
  return (
    <Modal
      title="Bos Credits Transfer"
      visible={visible}
      okText="Confirm"
      cancelText='Close'
      width='60%'
      okButtonProps={{ disabled: !isOk }}
      destroyOnClose
      onCancel={handleCancel}
      maskClosable={false}
      onOk={() => {
        let from_id: number | string = id;
        let to_id: number | string = user;
        let itc: number = multiply(value, 100);
        if (action === 1) {
          from_id = user;
          to_id = id;
        }
        onMessage({ from_id, to_id, itc: Number(itc) });
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={6} className="text-align-right" offset={1}>
          BOS ID
        </Col>
        <Col span={17}>{id}</Col>
        <Col span={6} className="text-align-right" offset={1}>
          BOS Name
        </Col>
        <Col span={17}>{display_name}</Col>
        <Col span={6} className="text-align-right" offset={1}>
          BOS Unallocated Balance
        </Col>
        <Col span={17}>${(sv / 100).toFixed(2)} USD</Col>
        <Col span={6} className="text-align-right" offset={1}>
          Action
        </Col>
        <Col span={17}>
          <Select
            className="width-hundred-percent"
            value={action}
            options={[
              { label: "Add credits from BOS Wallet", value: -1 },
              { label: "Transfer credits to BOS Wallet", value: 1 },
            ]}
            onChange={(v) => setAction(v)}
          />
        </Col>
        <Col span={6} className="text-align-right" offset={1}>
          Members
        </Col>
        <Col span={17}>
          <Select
            className="width-hundred-percent"
            onChange={changeUser}
            defaultValue={-1}
          >
            <Select.Option key="-1" value={-1}>
              Choose
            </Select.Option>
            {members.length > 0 &&
              members.map((item: member, index: number) =>
                <Select.Option key={index} value={item.id}>
                  {item.nickname}
                </Select.Option>
              )}
          </Select>
        </Col>
        {show && (
          <Col span={17} offset={7}>
            <Spin spinning={loading}>
              Available Itc:<span className='text-bold-7'>${multiply(canUseItc, 0.01)} USD</span>
            </Spin>
          </Col>
        )}
        <Col span={6} className="text-align-right" offset={1}>
          Adjust Value(USD)
        </Col>
        <Col span={17}>
          <InputNumber
            className="width-hundred-percent"
            onChange={(v) => setValue(Number(v) || 0)}
            min={1}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default memo(BOSCredit);
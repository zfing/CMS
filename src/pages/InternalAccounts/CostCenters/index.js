import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal, Form, Input, Row } from "antd";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import { log_submit, getCostCenters } from "./service";

const CostCenter = () => {
  const [loading, setLoading] = useState(true);
  const [fresh, setFresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [curItem, setCurItem] = useState({});
  const [values, setValues] = useState({});
  const [costCenter, setCostCenter] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    get_cost_center();
  }, [fresh]);

  async function get_cost_center() {
    try {
      let {
        data: { data },
      } = await getCostCenters();
      if (data.length > 0) {
        const CostCenter = data.filter(
          (item) => item.category === "COSTCENTER"
        );
        setCostCenter(CostCenter);
        setLoading(false);
      }
    } catch (err) {
      message.error(err?.error?.msg);
      setLoading(false);
    }
  }

  const columns = [
    {
      title: "CODE",
      columnTitle: "white",
      width: "15%",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "NAME",
      columnTitle: "white",
      width: "35%",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "DESCRIPTION",
      columnTitle: "white",
      width: "40%",
      dataIndex: "comments",
      key: "comments",
    },
    {
      width: "10%",
      render: (item) =>
        HasPermi(1006101) && (
          <span
            className="blue link-hover-underline"
            onClick={() => {
              setCurItem(item);
              form.setFieldsValue({ name: item.name, comments: item.comments });
              setVisible(true);
            }}
          >
            Edit
          </span>
        ),
    },
  ];
  const allPage = (
    <div
      className="overflow-y-hidden overflow-x-hidden"
      style={{ marginTop: -5 }}
    >
      <Table
        className="margin-top-0 blue"
        columns={columns}
        dataSource={costCenter}
        rowKey="id"
        expandRowByClick
        pagination={false}
        tableLayout="fixed"
        loading={loading}
      />
    </div>
  );
  const tailLayout = {
    wrapperCol: { span: 24 },
    style: {
      margin: "20px 0 -20px",
      padding: "20px 0",
      borderTop: "1px #f0f0f0 solid",
    },
  };

  const handleOnCancel = () => {
    setVisible(false);
  };
  const confirm = (log_note) => {
    const postData = {
      log_note,
      ...values,
    };
    log_submit(postData, "post", curItem?.code)
      .then((res) => {
        if (res?.data?.data?.success === 1) {
          message.success("Success");
          setVisible(false);
          logModal.onCancel();
          setFresh(!fresh);
        }
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <div className="default-font content-box bg-white font-size-9">
      <Row className="color-white search-bar" align="middle"></Row>
      <div className="default-font content-box margin-0 bg-white">
        {allPage}
        <Modal
          title={`Edit Cost Center: ${curItem?.code}`}
          visible={visible}
          okText="Confirm"
          destroyOnClose
          maskClosable={false}
          onCancel={handleOnCancel}
          width="40%"
          footer={null}
        >
          <Form
            form={form}
            colon={false}
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            onFinish={(value) => {
              setValues(value);
              logModal.onShow();
            }}
            layout="vertical"
            // initialValues={{
            //   name: curItem?.name,
            //   comments: curItem?.comments,
            // }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "can't be empty" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="comments"
              rules={[{ required: true, message: "can't be empty" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Row justify="end">
                <Button onClick={handleOnCancel} className="margin-right-10">
                  Cancle
                </Button>
                <Button type="primary" htmlType="submit">
                  Confirm
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <WriteLog
          title={`Edit Cost Center: ${curItem?.code}`}
          onRef={(ref) => setLogModal(ref)}
          onOk={confirm}
        />
      </div>
    </div>
  );
};

export default CostCenter;

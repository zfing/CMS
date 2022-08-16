import React, { useState, useEffect, useImperativeHandle } from "react";
import { message, Modal, Table } from "antd";
import { log_submit } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
const LiabilitiesLog = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };
  const handleOnCancel = () => {  
    setVisible(false);
    setData([])
  };
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    }
  }));
  useEffect(() => {
    if(visible) {
      setLoading(true)
      const params = {
        page: pagination.current,
        page_size: pagination.pageSize,
        fetch_name:'liabilities_logs'
      }
      log_submit(params, null, props.curID)
      .then(res => {
        setData(res?.data?.data)
      })
      .catch(err => message.error(err?.error?.msg))
      .finally(_ => setLoading(false))
    }
  }, [visible, props.curID, pagination])
  const columns = [
    {
      title: "USER ID",
      key: "create_time",
      width: "20%",
      render: (item) => commonFilter('fDate',item.create_time)
    },
    {
      title: "Amount (USD)",
      key: "amount",
      width: "20%",
      render: (item) => commonFilter('centToUsd',item.amount)
    },
    {
      title: "TYPE",
      key: "create_time",
      render: (item) => `${item.wallet_type===0?"Student":"Teacher"} Wallet ${item.inout===-1?"In debt":"Debt Repayment"}`
    },
    {
      title: "ADMIN",
      key: "admin_name",
      dataIndex: 'admin_name'
    },
    {
      title: "REMARK",
      key: "remark",
      dataIndex: 'remark'
    }
  ]
  return (
    <Modal
      title='Liabilities Log'
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={handleOnCancel}
      width="60%"
      footer={null}
    >
      <Table
        loading={loading}
        rowKey="log"
        columns={columns}
        dataSource={data}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          total: data.length,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items`}</span>
          ),
        }}
      />
    </Modal>
  );
});

export default LiabilitiesLog;

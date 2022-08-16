import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { message, Modal, Spin, Table } from "antd";
import { get_list_log_submit } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";

const WithdrawDetail = forwardRef((props, ref) => {
  const { userId } = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });

  useEffect(() => {
    visible && fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, pagination]);
  const fetch = () => {
    setLoading(true);
    let params = {
      page: pagination.current ? pagination.current : 1,
      page_size: pagination.pageSize ? pagination.pageSize : 20,
      user: userId,
      fetch_name: 'withdraw_list'
    };
    get_list_log_submit(params)
      .then((res) => {
        const { data } = res;
        setData(data);
      })
      .catch((err) => message.error(err?.error?.msg))
      .finally((_) => setLoading(false));
  };
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      setPagination({
        pageSize: 20,
        current: 1,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
      });
    },
    close: handleCancel,
  }));
  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };
  const Columns = [
    {
      title: "ORDER ID",
      dataIndex: 'order_id'
    },
    {
      title: "AMOUNT (USD)",
      render: (item) => commonFilter('centToUsd',item.amount)
    },
    {
      title: "STATUS",
      render: (item) => commonFilter('withdrawStatus', item.status)
    },
    {
      title: "WITHDRAW METHOD",
      render: (item) => <>
        <span>{commonFilter('payType', item.account_type)}</span>
        <br />
        <span>{item.account}</span>
      </>
    },
    {
      title: "WITHDRAW TYPE",
      render: (item) => commonFilter('withdrawType', item.withdraw_type)
    },
    {
      title: "APPLY TIME",
      render: (item) => commonFilter('fDate',item.create_time)
    }
  ];
  const handleCancel = () => {
    setVisible(false)
    setData([])
  }
  return (
    <Modal
      destroyOnClose
      visible={visible}
      maskClosable
      footer={false}
      onCancel={handleCancel}
      width='70%'
      title='Withdraw Detail'
    >
      <Spin spinning={loading}>
        <Table
          pagination={{
            ...pagination,
            total: data?.meta?.total,
            showTotal: () => (
              <span className="text-bold">
                Total: {data?.meta?.total} items
              </span>
            ),
          }}
          columns={Columns}
          dataSource={data.data}
          tableLayout="fixed"
          rowKey="id"
          size="small"
          onChange={handleTableChange}
        />
      </Spin>
    </Modal>
  );
});
export default WithdrawDetail;

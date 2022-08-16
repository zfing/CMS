import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { message, Modal, Spin, Table } from "antd";
import api from "../../../../components/Api";
import moment from "moment";

const AccountHistory = forwardRef((props, ref) => {
  const { userId } = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ data: [], meta: {} });
  const [curKey, setCurKey] = useState("1");
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
      wallet_type: curKey === "1" ? 0 : 1,
    };
    api
      .get(`/wallet/user/${userId}?fetch_name=status_his`, { params })
      .then((res) => {
        const { data } = res;
        setData(data);
      })
      .catch((err) => message.error(err?.error?.msg))
      .finally((_) => setLoading(false));
  };
  useImperativeHandle(ref, () => ({
    open: (key) => {
      setCurKey(key);
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
      title: "时间",
      render: (item) => moment(item.create_time).utc().format("YYYY-MM-DD HH:mm")
    },
    {
      title: "身份",
      render: (item) => item.wallet_type === 0 ? "学生" : "老师"
    },
    {
      title: "状态",
      render: (item) => item.action_type === 0 ? "解冻" : "冻结"
    },
    {
      title: "原因",
      render: (item) => item.comments
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
      title={
        ["1", "2"].includes(curKey) && curKey === "2"
          ? "Teacher Account History"
          : "Student Account History"
      }
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
export default AccountHistory;

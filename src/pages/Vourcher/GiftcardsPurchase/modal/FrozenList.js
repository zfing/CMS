import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { message, Col, Modal, Spin, Table } from "antd";
import api from "../../../../components/Api";
import moment from "moment";
import WriteLog from "../../../../components/CommonComponent/WriteLog";

const FrozenList = forwardRef((props, ref) => {
  const { userId, fresh } = props;
  const [frozenListVisible, setFrozenListVisible] = useState(false);
  const [data, setData] = useState({ data: [], meta: {} });
  const [curKey, setCurKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const [curItem, setCurItem] = useState({});
  const [logModal, setLogModal] = useState(false);
  const [curFresh, setCurFresh] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });

  useEffect(() => {
    frozenListVisible && fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozenListVisible, pagination, curFresh]);
  const fetch = () => {
    setLoading(true);
    let params = {
      page: pagination.current ? pagination.current : 1,
      page_size: pagination.pageSize ? pagination.pageSize : 20,
      wallet_type: curKey === "1" ? 0 : 1,
    };
    api
      .get(`/wallet/user/${userId}?fetch_name=freeze_list`, { params })
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
      setFrozenListVisible(true);
      setPagination({
        pageSize: 20,
        current: 1,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
      });
    },
    close: handleCancel,
  }));
  const handleCancel = () => {
    setFrozenListVisible(false)
    setData([])
  }
  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };
  const walletColumns = [
    {
      title: "TIME",
      width: "150px",
      render: (item) => (
        <div>
          F:{moment(item.create_time).format("YYYY-MM-DD HH:mm")}
          <br />
          {item.unfrozen_create_time &&
            "U:" + moment(item.unfrozen_create_time).format("YYYY-MM-DD HH:mm")}
        </div>
      ),
    },
    {
      title: "WALLET TYPE",
      width: "150px",
      render: (item) =>
        item.wallet_type === 0 ? "Student Wallet" : "Teacher Wallet",
    },
    {
      title: "INFORMATION",
      width: "400px",
      render: (item) => (
        <div>
          <Col span={24}>
            {" "}
            Admin:{item.admin_name} | Status：Frozen | Amount $
            {(item.trans_amount / 100).toFixed(2)} USD
            <br />
            comment:{item.comments}
          </Col>
          {item.unfrozen_admin_name && (
            <Col span={24} className="border-top-1">
              {" "}
              Admin:{item.unfrozen_admin_name} | Status：Unfrozen | Amount $
              {(item.unfrozen_amount / 100).toFixed(2)} USD
              <br />
              comment:{item.unfrozen_comments}
            </Col>
          )}
        </div>
      ),
    },
    {
      title: "STATUS",
      render: (item) =>
        item.unfrozen_amount > 0 ? "Has been unfreezed" : "Frozen",
    },
    {
      render: (item) => {
        return (
          item.unfrozen_amount === "" && (
            <span
              className="link-hover-underline blue"
              onClick={() => {
                setCurItem(item)
                logModal.onShow()
              }} 
            >
              Unfreeze
            </span>
          )
        );
      },
    },
  ];
  const confirm = (log_note) => {
    let postData = {
      log_note,
      accountlog_id: curItem.id,
      itc: curItem.trans_amount
    };
    switch (curKey) {
      case "1":
        Reflect.set(postData, "operate", "unfrozen_sv_part");
        break;
      case "2":
        Reflect.set(postData, "operate", "unfrozen_tv_part");
        break;
      default:
        return null;
    }
    api
      .post(`/wallet/user/${userId}`, postData)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        if (success) {
          logModal.onCancel();
          setCurFresh(!curFresh);
          fresh()
        }
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  return (
    <Modal
      destroyOnClose
      visible={frozenListVisible}
      maskClosable
      footer={false}
      onCancel={handleCancel}
      width='70%'
      title={
        ["1", "2"].includes(curKey) && curKey === "2"
          ? "Teacher Wallet Frozen Part History"
          : "Student Wallet Frozen Part History"
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
          columns={walletColumns}
          dataSource={data.data}
          tableLayout="fixed"
          rowKey="id"
          size="small"
          onChange={handleTableChange}
        />
      </Spin>
      <WriteLog
        title={
          ["1", "2"].includes(curKey) && curKey === "2"
            ? "Unfrozen Teacher Wallet Part"
            : "Unfrozen Student Wallet Part"
        }
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
      />
    </Modal>
  );
});
export default FrozenList;

import React, { useImperativeHandle, useState, useEffect } from "react";
import { Modal, Table, notification, Row, Col } from "antd";
import api from "../../../../components/Api";
import qs from "qs";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
import moment from "moment";

const OperatorModal = React.forwardRef((props, ref) => {
  const { userId } = props;
  const [visible, setVisible] = useState(false);
  const [operate, setOperate] = useState();
  const [modalData, setModalData] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(true);
  useImperativeHandle(ref, () => ({
    openModal: (type, title) => {
      setOperate(type);
      setTitle(title);
      setPagination({
        pageSize: 20,
        current: 1,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
      });
      setVisible(true);
    },
  }));

  const operate1Columns = [
    {
      title: <span className="font-size-13">PAYMENT ID</span>,
      key: "order_id",
      dataIndex: "order_id",
    },
    {
      title: <span className="font-size-13">TIME (UTC)</span>,
      key: "create_time",
      render: (selObj) =>
        moment.utc(selObj.create_time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: <span className="font-size-13">PAYMENT METHOD</span>,
      key: "pay_type",
      render: (selObj) => (
        <span>{commonFilter("payType", selObj.pay_type)}</span>
      ),
    },

    {
      title: <span>AMOUNT (USD)</span>,
      key: "amount",
      render: (selObj) => <span>{(selObj.amount / 100).toFixed(2)}</span>,
    },
    {
      title: <span>STATUS</span>,
      key: "status",
      render: (selObj) => (
        <span>{commonFilter("purchaseStatus", selObj.status)}</span>
      ),
    },
  ];
  const operate2Columns = [
    {
      title: <span>TRANSACTION ID</span>,
      key: "order_id",
      dataIndex: "order_id",
    },
    {
      title: <span>DESCRIPTION</span>,
      key: "show_type",
      render: (selObj) => {
        let temp = "";
        let tempTransactionType = JSON.parse(
          localStorage.getItem("transactionShowtype")
        );
        if (tempTransactionType) {
          let tempType = tempTransactionType.filter(
            (item) => item.type === selObj.show_type
          );
          temp = <span>{`(${tempType[0]?.type}) ${tempType[0]?.name}`}</span>;
        } else {
          temp = "";
        }
        return temp;
      },
    },
    {
      title: <span>AMOUNT (USD)</span>,
      key: "trans_amount",
      render: (item) => (
        <span>{((item.trans_amount * item.inout) / 100).toFixed(2)}</span>
      ),
    },
    {
      title: <span>BALANCE (USD)</span>,
      key: "original_amount",
      render: (item) => (
        <span>
          {(
            (item.original_amount + item.trans_amount * item.inout) /
            100
          ).toFixed(2)}
        </span>
      ),
    },
    {
      title: <span>TIME (UTC)</span>,
      key: "create_time",
      render: (selObj) => (
        <span>{moment.utc(selObj.create_time).format("YYYY-MM-DD HH:mm")}</span>
      ),
    },
  ];
  const operate3Columns = [
    {
      title: <span>TRANSACTION TYPE</span>,
      key: "show_type",
      render: (selObj) => {
        let temp = "";
        if (props.typeData) {
          let tempTransactionType = props.typeData;
          tempTransactionType = tempTransactionType.filter(
            (item) => item.type === selObj.show_type
          );
          temp = (
            <span>{`(${tempTransactionType[0]?.type}) ${tempTransactionType[0]?.name}`}</span>
          );
        } else {
          temp = "";
        }
        return temp;
      },
    },
    {
      title: <span className="float-right">AMOUNT (USD)</span>,
      key: "amount",
      render: (selObj) => <span>{(selObj.amount / 100).toFixed(2)}</span>,
      className: "text-align-right",
    },
  ];
  const operate4Columns = operate2Columns;
  const operate5Columns = [
    {
      title: <span>ORDER ID</span>,
      width: "15%",
      key: "order_id",
      render: (selObj) => <span>{selObj.order_id}</span>,
    },
    {
      title: <span>AMOUNT (USD)</span>,
      key: "amount",
      width: "10%",
      render: (item) => <span>{(item.amount / 100).toFixed(2)}</span>,
    },
    {
      title: <span>STATUS</span>,
      key: "status",
      width: "20%",
      render: (selObj) => (
        <span>{commonFilter("withdrawStatus", selObj.status)}</span>
      ),
    },
    {
      title: <span>WITHDRAW METHOD</span>,
      key: "account_type",
      width: "20%",
      render: (item) => (
        <span>
          {commonFilter("payType", item.account_type)}
          <br />
          {item.account}
        </span>
      ),
    },
    {
      title: <span>WITHDRAW TYPE</span>,
      key: "withdraw_type",
      width: "15%",
      render: (item) => (
        <span>{commonFilter("withdrawType", item.withdraw_type)}</span>
      ),
    },
    {
      title: <span>APPLY TIME</span>,
      key: "create_time",
      width: "20%",
      render: (item) => (
        <span>{moment.utc(item.create_time).format("YYYY-MM-DD HH:mm")}</span>
      ),
    },
  ];
  const operate6Columns = operate3Columns;
  const operate7Columns = operate2Columns;
  const operate8Columns = operate5Columns;
  const operate9Columns = operate3Columns;

  const columnsObj = {
    1: operate1Columns,
    2: operate2Columns,
    3: operate3Columns,
    4: operate4Columns,
    5: operate5Columns,
    6: operate6Columns,
    7: operate7Columns,
    8: operate8Columns,
    9: operate9Columns,
  };

  const getData = async (searchParams, uri) => {
    setLoading(true);
    setModalData([]);
    let params = {
      ...searchParams,
    };
    try {
      const res = await api.get(uri, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      });
      setLoading(false);
      setModalData({ data: [...res.data.data], meta: res.data.meta });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Can not get data",
      });
      setLoading(false);
    }
  };

  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };

  useEffect(() => {
    if (userId && operate) {
      let postData = {
        page: pagination.current ? pagination.current : 1,
        page_size: pagination.pageSize ? pagination.pageSize : 20,
      };
      let temp = {
        1: { status: [1, 6], user: userId },
        2: { fetch_name: "student" },
        3: { fetch_name: "transaction_statistics", wallet_type: 0 },
        4: { fetch_name: "teacher" },
        5: { fetch_name: "withdraw_list", user: userId },
        6: { fetch_name: "transaction_statistics", wallet_type: 1 },
        7: { fetch_name: "affiliate" },
        8: { user: userId },
        9: { fetch_name: "transaction_statistics", wallet_type: 2 },
      };
      const uriObj = {
        1: "credits/purchase-list",
        5: "withdraw/teacher-withdrawals",
        8: "withdraw/affiliate-withdrawals",
      };
      const urls = {
        2: `user/${userId}/transaction`,
        4: `user/${userId}/transaction`,
        7: `user/${userId}/transaction`,
      };
      getData(
        {
          ...postData,
          ...temp[operate],
        },
        uriObj.hasOwnProperty(operate) ? uriObj[operate] : urls[operate]
      );
    }
  }, [operate, pagination, userId]);

  return (
    <Modal
      title={title}
      visible={visible}
      width={[3, 6, 9].includes(operate) ? "45vw" : "70vw"}
      destroyOnClose
      onCancel={() => setVisible()}
      footer={null}
    >
      <Row gutter={[0, 16]} className="table-top-24">
        <Col span={24}>
          <Table
            pagination={{
              ...pagination,
              total: modalData?.meta?.total,
              showTotal: () => {
                if ([3, 6, 9].includes(operate)) {
                  return `Total ${
                    modalData?.data?.length > 0 ? modalData?.data?.length : 0
                  } items`;
                } else {
                  return (
                    <span className="text-bold">
                      Total: {modalData?.meta?.total} items
                      {[2, 4, 7].includes(operate) &&
                        ` 丨 Amount: $${(
                          modalData?.meta?.total_trans_itc / 100
                        ).toFixed(2)}USD`}
                    </span>
                  );
                }
              },
            }}
            destroyOnClose
            columns={columnsObj[operate]}
            dataSource={modalData?.data}
            onChange={handleTableChange}
            rowKey="id"
            loading={loading}
          ></Table>
        </Col>
      </Row>
    </Modal>
  );
});

export default OperatorModal;

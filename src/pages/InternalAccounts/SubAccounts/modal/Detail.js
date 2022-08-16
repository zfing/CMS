import React, { useImperativeHandle, useState, useEffect } from "react";
import {
  Modal,
  Table,
  notification,
  Row,
  Col,
  Button,
  Input,
  DatePicker,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { WalletType } from "../../../Wallet/WalletConst";
import moment from "moment";
import CSVDownload from "../../../../components/CommonComponent/CSVDownloadModal/CSVDownloadModal";
import { get_detail } from "../service";

const { RangePicker } = DatePicker;

const Detail = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState({ data: [], meta: { total: 0 } });
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [curItem, setCurItem] = useState({});
  const [userID, setUserID] = useState(null);
  const [date, setDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [downVisible, setDownVisible] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  useImperativeHandle(ref, () => ({
    open: (item) => {
      setCurItem(item);
      setPagination({
        pageSize: 20,
        current: 1,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
      });
      setVisible(true);
    },
  }));

  const Columns = [
    {
      title: <span>TRANSACTION ID</span>,
      key: "order_id",
      width: "10%",
      dataIndex: "order_id",
    },
    {
      title: <span>DESCRIPTION</span>,
      key: "show_type",
      width: "30%",
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
      width: "10%",
      render: (item) => (
        <span>{((item.trans_amount * item.inout) / 100).toFixed(2)}</span>
      ),
    },
    {
      title: <span>BALANCE (USD)</span>,
      key: "original_amount",
      width: "10%",
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
      width: "20%",
      render: (selObj) => (
        <span>{moment.utc(selObj.create_time).format("YYYY-MM-DD HH:mm")}</span>
      ),
    },
    {
      title: <span>RELATION WALLET</span>,
      key: "relation_userid",
      width: "10%",
      dataIndex: "relation_userid",
    },
    {
      title: <span>WALLET TYPE</span>,
      width: "10%",
      key: "relation_type",
      render: (selObj) => <span>{WalletType(selObj.relation_type, 1)}</span>,
    },
  ];

  const getData = async (searchParams) => {
    setLoading(true);
    setModalData({});
    let params = {
      ...searchParams,
      page: pagination.current ? pagination.current : 1,
      page_size: pagination.pageSize ? pagination.pageSize : 20,
      fetch_name: "student",
    };
    try {
      const res = await get_detail(params, curItem.id);
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
    visible && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, pagination]);

  const search = () => {
    getData({
      relation_userid: userID,
      min_create_time: date?.min_create_time,
      max_create_time: date?.max_create_time,
    });
  };
  return (
    <Modal
      title={
        <span>
          {`Sub Accounts : ${curItem.id} Transaction Detail`}{" "}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="width-46 margin-right-10"
            onClick={() => setSearchModal(!searchModal)}
          />
        </span>
      }
      visible={visible}
      width="80%"
      destroyOnClose
      maskClosable={false}
      onCancel={() => {
        setVisible(false);
        setSearchModal(false);
        setDate(null);
        setUserID(null);
      }}
      footer={null}
    >
      {searchModal && (
        <Row align="bottom">
          <Col span={6}>
            <span>RELATION WALLET</span>
            <Input
              defaultValue={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
          </Col>
          <Col span={8} offset={1}>
            <span>TIME (UTC)</span>
            <RangePicker
              defaultValue={
                date?.min_create_time && date?.max_create_time
                  ? [
                      moment(date?.min_create_time),
                      moment(date?.max_create_time),
                    ]
                  : []
              }
              className="width-hundred-percent"
              format="YYYY-MM-DD"
              ranges={{
                "Last 30 Days": [moment().subtract(30, "days"), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "Last Month": [
                  moment().subtract(1, "months").startOf("month"),
                  moment().subtract(1, "months").endOf("month"),
                ],
                "This Year": [moment().startOf("year"), moment().endOf("year")],
                "Last Year": [
                  moment().subtract(1, "years").startOf("year"),
                  moment().subtract(1, "years").endOf("year"),
                ],
              }}
              onChange={(date, dateString) =>
                setDate({
                  ...date,
                  min_create_time: dateString[0],
                  max_create_time: dateString[1],
                })
              }
            />
          </Col>
          <Col offset={3} span={6} className="flex-end-only">
            <Button type="primary" style={{ marginRight: 5 }} onClick={search}>
              Search
            </Button>
            <Button
              disabled={!date?.min_create_time}
              onClick={() => setDownVisible(true)}
              type="primary"
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      )}

      <Row gutter={[0, 16]} className="table-top-24">
        <Col span={24}>
          <Table
            pagination={{
              ...pagination,
              total: modalData?.meta?.total,
              showTotal: () => (
                <span className="text-bold">
                  {`Total: ${modalData?.meta?.total} items 丨 Amount: $${(
                    modalData?.meta?.total_trans_itc / 100
                  ).toFixed(2)} USD`}
                </span>
              ),
            }}
            destroyOnClose
            columns={Columns}
            dataSource={modalData?.data}
            onChange={handleTableChange}
            rowKey="id"
            loading={loading}
          ></Table>
        </Col>
      </Row>
      <CSVDownload
        downloadName="transactions"
        visible={downVisible}
        title='Download Transaction List'
        closeModalFunc={() => {
          setDownVisible(false);
        }}
        all={false}
        defaultCheckbox={[
          {
            postParam: "order_id",
            title: "TRANSACTION ID",
            defaultValue: 1,
            span: 24,
          },
          {
            postParam: "show_type",
            title: "DESCRIPTION",
            defaultValue: 1,
            span: 24,
          },
          {
            postParam: "trans_amount",
            title: "AMOUNT (USD)",
            defaultValue: 1,
            span: 24,
          },
          {
            postParam: "create_time",
            title: "TIME (UTC)",
            defaultValue: 1,
            span: 24,
          },
          {
            postParam: "original_amount",
            title: "BALANCE (USD)",
            defaultValue: 0,
            span: 24,
          },
          {
            postParam: "relation_userid",
            title: "RELATION WALLET",
            defaultValue: 0,
            span: 24,
          },
          {
            postParam: "relation_type",
            title: "WALLET TYPE",
            defaultValue: 0,
            span: 24,
          }
        ]}
        defaultChecked={[
          "TRANSACTION ID",
          "DESCRIPTION",
          "AMOUNT (USD)",
          "TIME (UTC)"
        ]}
        selectObj={{
          relation_userid: userID,
          min_create_time: date?.min_create_time,
          max_create_time: date?.max_create_time,
          fetch_name: 'student'
        }}
        downloadUrl={`/user/${curItem.id}/transaction`}
      />
    </Modal>
  );
});

export default Detail;

import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Table, notification, Col } from "antd";
import moment from "moment";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { get_list } from "./service";
import { UserIdType, WalletType } from "../WalletConst";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";
import "../wallet.css";

const CreditHistoryList = React.forwardRef((props, ref) => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [queryData, setQueryData] = useState({});
  const detailRef = useRef(null);
  const other = useRef(null);

  useImperativeHandle(ref, () => ({
    search: () => {
      setPagination({ ...pagination, current: 1 });
    },
  }));
  const tableColumns = [
    {
      title: "DATE(UTC)",
      key: "create_time",
      width: "15%",
      render: (item) =>
        moment.utc(item.create_time).utc().format("YYYY-MM-DD HH:mm"),
    },
    {
      title: <span>TX ID</span>,
      key: "order_id",
      width: "10%",
      dataIndex: "order_id",
    },
    {
      title: <span>FROM WALLET</span>,
      key: "account_id",
      width: "15%",
      render: (item) => {
        switch (UserIdType(item.account_id)) {
          case 1:
            return (
              <>
                <span
                  className="link-hover-underline cursor-pointer blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    detailRef.current.open(item.account_id);
                  }}
                >
                  {item.account_id}
                </span>
                <br />
                <span>{WalletType(item.wallet_type)}</span>
              </>
            );
          case 2:
            return (
              <>
                <span>{item.account_id}</span>
                <br />
                <span>italki Wallet</span>
              </>
            );
          case 3:
            return (
              <>
                <span>{item.account_id}</span>
                <br />
                <span>BOS Account</span>
              </>
            );
          default:
            return null;
        }
      },
    },
    {
      title: <span>TO WALLET</span>,
      key: "wallet_type",
      width: "15%",
      render: (item) => {
        switch (UserIdType(item.relate_account_id)) {
          case 1:
            return (
              <>
                <span
                  className="link-hover-underline cursor-pointer blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    detailRef.current.open(item.relate_account_id);
                  }}
                >
                  {item.relate_account_id}
                </span>
                <br />
                <span>{WalletType(item.relation_type)}</span>
              </>
            );
          case 2:
            return (
              <>
                <span>{item.relate_account_id}</span>
                <br />
                <span>italki Wallet</span>
              </>
            );
          case 3:
            return (
              <>
                <span>{item.relate_account_id}</span>
                <br />
                <span>BOS Account</span>
              </>
            );
          default:
            return null;
        }
      },
    },
    {
      title: <span>AMOUNT(USD)</span>,
      key: "trans_amount",
      width: "10%",
      render: (item) => commonFilter("centToUsd", item.trans_amount),
    },
    {
      title: <span>TX TYPE</span>,
      key: "show_type",
      width: "15%",
      render: (item) => (
        <span>{`(${item.show_type})${commonFilter(
          "transactionShowtype",
          item.show_type
        )}`}</span>
      ),
    },
    {
      title: <span>OPERATOR</span>,
      key: "admin_name",
      width: "10%",
      dataIndex: "admin_name",
    },
    {
      width: "10%",
      key: "comments",
      render: (item) => <span className="word-break">{item.comments}</span>,
    },
  ];

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = { ...searchParams, ...other?.current?.getValue() };
    get_list(params)
      .then((result) => {
        setResultObj({ data: result.data.data, meta: result.data.meta });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Cannot get data",
        });
      })
      .finally((_) => setLoading(false));
  };

  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...props.params,
      ...queryData,
    });
  }, [pagination, props.params, queryData]);

  return (
    <>
      {props.filterShow && (
        <Col
          className={`${
            props.filterShow === true ? "gutter-example" : "display-none"
          } search-more`}
        >
          <CommonSelects
            search={(value) => {
              props.update();
              setPagination({ ...pagination, current: 1, page: 1 });
              setQueryData(value);
            }}
            ref={other}
            allSearch={[
              {
                type: "searchBySelect",
                title: "From Wallet Type",
                postParam: "account_id",
                optionsArr: [
                  { v: "-1", t: "From italki Wallet" },
                  { v: "0", t: "From Student Wallet" },
                  { v: "1", t: "From Teacher Wallet" },
                  { v: "2", t: "From Affiliate Wallet" },
                ],
              },
              {
                type: "searchByInput",
                title: "From Wallet ID",
                postParam: "wallet_type",
                placeholder: "Wallet ID",
              },
              {
                type: "searchBySelect",
                title: "To Wallet Type",
                postParam: "relation_type",
                optionsArr: [
                  { v: "-1", t: "To italki Wallet" },
                  { v: "0", t: "To Student Wallet" },
                  { v: "1", t: "To Teacher Wallet" },
                  { v: "2", t: "To Affiliate Wallet" },
                ],
              },
              {
                type: "searchByInput",
                title: "To Wallet ID",
                postParam: "relate_account_id",
                placeholder: "Wallet ID",
              },
              {
                type: "searchByDatepicker",
                title: "Time",
                minPostParam: "min_ct",
                maxPostParam: "max_ct",
              },
            ]}
          />
        </Col>
      )}
      <Table
        className="margin-top-0 blue Table"
        columns={tableColumns}
        dataSource={resultObj.data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items | Amount: $${commonFilter(
              "centToUsd",
              resultObj.meta.sum_amount
            )} USD`}</span>
          ),
        }}
        expandRowByClick
        onChange={handleTableChange}
      ></Table>
      <Detail type="AccountWallet" ref={detailRef} />
    </>
  );
});

export default CreditHistoryList;

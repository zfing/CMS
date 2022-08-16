import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import {
  Table,
  notification,
  Dropdown,
  Tooltip,
  Col,
  Menu,
  Button,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { get_list } from "./service";
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
      title: "USER ID",
      key: "referree_id",
      width: "10%",
      render: (item) => (
        <span className="blue link-hover-underline" onClick={() => detailRef?.current?.open(item.referree_id)}>{item.referree_id}</span>
      ),
    },
    {
      title: "AFFILIATE ID",
      key: "affiliate_user_id",
      width: "10%",
      render: (item) => (
        <span className="blue link-hover-underline" onClick={() => detailRef?.current?.open(item.affiliate_user_id)}>
          {item.affiliate_user_id}
        </span>
      ),
    },
    {
      title: "DATE (UTC)",
      key: "create_time",
      width: "15%",
      render: (item) => (
        <>
          {/* <!--注册日期--> */}
          <span>R: {commonFilter("fDate", item.create_time)}</span>
          <br />
          {/* <!--第一次购买日期--> */}
          <span>P: {commonFilter("fDate", item.first_purchase_time)}</span>
          <br />
          {/* <!--更新时间--> */}
          <span>U: {commonFilter("fDate", item.update_time)}</span>
        </>
      ),
    },
    {
      title: "REFERREE BONUS",
      key: "wallet_type",
      width: "10%",
      render: (item) => (
        <>
          {item.referree_bonus > 0 && (
            <span>USD: {commonFilter("centToUsd", item.referree_bonus)}</span>
          )}
          {item.referree_voucher_id > 0 && (
            <span>Voucher ID: {item.referree_voucher_id}</span>
          )}
          {item.referree_bonus === 0 && item.referree_voucher_id === 0 && (
            <span>No Paid</span>
          )}
        </>
      ),
    },
    {
      title: "REF CODE",
      key: "trans_amount",
      width: "10%",
      dataIndex: "ref_code_id",
    },
    {
      title: "REF URL",
      key: "show_type",
      width: "35%",
      render: (item) => <span className="word-break">{item.ref_url}</span>,
      // render: (item) => <a href={item.ref_url} rel="noopener noreferrer" target='_blank'  className='word-break'>{item.ref_url}</a>
    },
    {
      width: "10%",
      key: "actions",
      render: (item) => {
        const menu = () => (
          <Menu
            className="dropdown-button"
            style={{ width: "100%" }}
            // onClick={(obj) => Actions(obj, item)}
          >
            {item.referree_bonus === 0 && (
              <Menu.Item
                key="1"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                Transfer Credits
              </Menu.Item>
            )}
            {item.referree_voucher_id === 0 && (
              <Menu.Item
                key="2"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                Bind Voucher
              </Menu.Item>
            )}
          </Menu>
        );
        return (
          item.referree_bonus === 0 &&
          item.referree_voucher_id === 0 &&
          HasPermi(1002601) && (
            <Dropdown
              overlay={menu()}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Tooltip
                title={"More actions"}
                overlayStyle={{ whiteSpace: "nowrap" }}
              >
                <Button
                  onClick={(e) => e.stopPropagation()}
                  type="default"
                  className={`float-right blue margin-10-20-0-0`}
                  shape="circle"
                  icon={<MoreOutlined />}
                ></Button>
              </Tooltip>
            </Dropdown>
          )
        );
      },
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
                type: "searchByInput",
                title: "Ref Code",
                postParam: "ref_code",
              },
              {
                type: "searchByInput",
                title: "Ref Url",
                postParam: "ref_url",
              },
              {
                type: "searchBySelect",
                title: "Referree Bouns",
                postParam: "bouns_type",
                optionsArr: [
                  { v: "0", t: "None bouns" },
                  { v: "1", t: "Credits / Voucher" },
                  { v: "2", t: "Transfer Credits" },
                  { v: "3", t: "Voucher" },
                ],
              },
              {
                type: "searchByDatepickerWithSelect",
                title: "Time Type",
                optionsArr: [
                  { v: 0, t: "Purchase Time" },
                  { v: 1, t: "Register Time" },
                ],
                postParam: ["min_fpt", "max_fpt", "min_rt", "max_rt"],
                defaultOption: 0,
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
            <span className="font-size-15 text-bold">{`Total:${total} items`}</span>
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

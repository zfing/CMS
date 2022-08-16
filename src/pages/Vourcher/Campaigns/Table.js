import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Table, Button, notification, Col } from "antd";
import api from "../../../components/Api";
import moment from "moment";
import Detail from "./Detail/Detail";
import { voucherConditionJson, voucherCondition } from "../CommonConst";
import {
  vtObj,
  commonFilter,
} from "../../../components/CommonComponent/CommonFunction";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import "./Campaigns.css";
import {
  voucherAccount,
  // showTypeObj,
  voucherCategory,
  usage,
  categoryType,
  timeType
} from "../CommonConst";
import MoreInformation from "../../../components/CommonComponent/MoreInformation";

const FriendRequestList = React.forwardRef((props, ref) => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [queryData, setQueryData] = useState({});
  const [expandArr, setExpandArr] = useState([]);
  const [freshDate, setFreshDate] = useState(false);
  const detailRef = useRef(null);

  useImperativeHandle(ref, () => ({
    search: () => {
      setPagination({ ...pagination, current: 1 });
    },
  }));

  const operate = (selObj, title, e) => {
    e.stopPropagation();
    console.log("selObj", selObj, title, e);
    api({
      url: `/voucher/campaign/${selObj.category_code}`,
      method: "get",
    }).then((res) => {
      detailRef.current.open(title, res.data.data);
    });
  };

  const tableColumns = [
    {
      title: <span>CREATE &amp; EXPIRY</span>,
      key: "create_time",
      width: "20%",
      render: (item) => (
        <span>
          C: {moment.utc(item.create_time).format("YYYY-MM-DD HH:mm")}
          <br />
          E: {moment.utc(item.end_time).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
    {
      title: <span>CAMPAIGN CODE</span>,
      key: "category_code",
      width: "15%",
      render: (selObj) => (
        <span className="world-break-break-all">{selObj.category_code}</span>
      ),
    },
    {
      title: <span>USAGE LIMIT</span>,
      key: "usage_limit",
      width: "15%",
      render: (item) => (
        <span>{item.usage_limit === 0 ? "Unlimited" : "One only"}</span>
      ),
    },
    {
      title: <span>CONDITION TYPE</span>,
      key: "condition",
      width: "20%",
      render: (item) => voucherCondition(item.condition, item?.condition_json)
    },
    {
      title: <span>STATUS</span>,
      key: "finish_flag",
      width: "10%",
      render: (item) =>
        voucherCategory.hasOwnProperty(item?.finish_flag?.toString())
          ? voucherCategory[item.finish_flag.toString()]
          : item.finish_flag,
    },
    {
      title: <span style={{ fontSize: 13 }}>VALUE (USD)</span>,
      key: "voucher_value",
      width: "10%",
      render: (item) => <span>{(item.voucher_value / 100).toFixed(2)}</span>,
    },
    {
      width: "10%",
      render: (item) => (
        <Button
          className="blue"
          type="link"
          onClick={(e) => operate(item, `${item.category_code} Detail`, e)}
        >
          View
        </Button>
      ),
    },
  ];

  const expandedRowRender = (item, index, indent, expanded) => {
    const tableObjectArr = [
      {
        t: "ID",
        v: item.id,
        position: 1,
        title_width: 8,
      },
      {
        t: "ACCOUNT",
        v: commonFilter(voucherAccount, item.account_code),
        position: 1,
        title_width: 8,
      },
      {
        t: "CONDITION TYPE",
        v: voucherConditionJson(item.condition, item.voucher_value, item.condition_json, true),
        position: 1,
        title_width: 8,
      },
      {
        t: "GENERATED VOUCHERS",
        v: (
          <span>
            Total&nbsp;
            <strong>{item.voucher_count ? item.voucher_count : 0}</strong>&nbsp;
            Vouchers,&nbsp;
            <strong>{commonFilter("centToUsd", item.all_itc)}</strong>&nbsp;USD
          </span>
        ),
        position: 1,
        title_width: 8,
      },
      {
        t: "VALIDITY PERIOD (UTC)",
        v: `${commonFilter('fDate', item.start_time)} to ${commonFilter('fDate', item.end_time)}`,
        position: 1,
        title_width: 8,
      },
      {
        t: "USED VOUCHERS",
        v: (
          <span>
            Total &nbsp;
            <strong>{item.used_count ? item.used_count : 0}</strong>
            &nbsp;Vouchers,&nbsp;
            <strong>{commonFilter("centToUsd", item.used_itc)}</strong>&nbsp;
            USD
          </span>
        ),
        position: 1,
        title_width: 8,
      },
      {
        t: "CREATE TIME (UTC)",
        v: commonFilter("fDate", item.create_time, "YYYY-MM-DD HH:mm"),
        position: 1,
        title_width: 8,
      },
      {
        t: "CATEGORY TYPE",
        v: commonFilter(categoryType, item.specify_coupon),
        position: 1,
        title_width: 8,
      },
      {
        t: "SPECIFY START DATE(UTC)",
        v: commonFilter("fDate", item.specify_start_date),
        position: 1,
        title_width: 8,
      },
      {
        t: "SPECIFY END DATE(UTC)",
        v: commonFilter("fDate", item.specify_end_date),
        position: 1,
        title_width: 8,
      },
      {
        t: "REMARK",
        v: item.remark,
        position: 1,
        title_width: 8,
      },
      {
        t: "CONDITION JSON",
        v: item.condition_json,
        position: 2,
        title_width: 4,
      },
      {
        t: "SPECIFY CONDITION JSON",
        v: item.specify_condition_json,
        position: 2,
        title_width: 4,
      },
    ];
    return <MoreInformation objectArr={tableObjectArr} />;
  };

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = { ...searchParams };
    const uri = "/voucher/campaigns";
    api
      .get(uri, { params })
      .then((result) => {
        setExpandArr([]);
        setResultObj({ data: result.data.data, meta: result.data.meta });
        setLoading(false);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Cannot get data",
        });
        setLoading(false);
      });
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
  }, [pagination, props.params, queryData, props.fresh, freshDate]);

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
            allSearch={[
              {
                type: "searchBySelect",
                title: "Account",
                postParam: "account_code",
                optionsArr: vtObj(voucherAccount)
              },
              {
                type: "searchBySelect",
                title: "Status",
                postParam: "status",
                optionsArr: vtObj(voucherCategory),
              },
              {
                type: "searchBySelect",
                title: "Condition Type",
                postParam: "condition",
                optionsArr: [
                  { v: 1, t: "Redeem USD Directly" },
                  { v: 2, t: "Buy $x get x USD Credits for free" },
                  { v: 3, t: "Buy $x get $x off" },
                ],
              },
              {
                type: "searchBySelect",
                title: "Usage# for the same user",
                postParam: "usage_limit",
                optionsArr: vtObj(usage),
              },
              {
                type: "searchBySelect",
                title: "Category Type",
                postParam: "category_type",
                optionsArr: vtObj(categoryType),
              },
              {
                type: "searchByDatepickerWithSelect",
                title: "Time Type",
                optionsArr: vtObj(timeType),
                postParam: [
                  "min_at",
                  "max_at",
                  "min_st",
                  "max_st",
                  "min_et",
                  "max_et",
                ],
                defaultOption: "0",
              },
              {
                type: "searchByRange",
                title: "ITC",
                toCent: true,
                minPostParam: "min_itc",
                maxPostParam: "max_itc",
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
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => `Total ${total} items`,
        }}
        loading={loading}
        expandRowByClick
        expandedRowKeys={expandArr}
        expandedRowRender={expandedRowRender}
        onExpand={(expanded, record) => {
          let temp = [...expandArr];
          if (expanded) {
            if (!temp.includes(record.id)) {
              temp.push(record.id);
            }
          } else {
            temp.splice(expandArr.indexOf(record.id), 1);
          }
          setExpandArr(temp);
        }}
        onChange={handleTableChange}
      ></Table>
      <Detail ref={detailRef} needFreshDate={() => setFreshDate(!freshDate)} />
    </>
  );
});

export default FriendRequestList;

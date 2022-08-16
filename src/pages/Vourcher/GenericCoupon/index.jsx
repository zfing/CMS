import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Table, message, Spin, Input } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import api from "../../../components/Api";
import moment from "moment";
import MoreInformation from "../../../components/CommonComponent/MoreInformation";
import GenericCoupon from "./modal/GenericCoupon";
import ViewEdit from "./modal/ViewEdit";
import {
  vtObj
} from "../../../components/CommonComponent/CommonFunction";
import { voucherAccount, voucherConditionJson } from "../CommonConst";

const GenericCouponList = (props) => {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    total: 1,
    current: 1,
    showTotal: (total) => `Total ${total} items`,
    showSizeChanger: true,
  });
  const [moreFilter, setMoreFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [fresh, setFresh] = useState(false);
  const other = useRef(null);
  const code = useRef(null);
  const GrnrricCouponRef = useRef(null);
  const ViewEditRef = useRef(null);
  const [rowKeys,setRowKeys]=useState([])
  useEffect(() => {
    getData();
  }, [fresh]);
  async function getData(params) {
    setRowKeys([])
    try {
      let {
        data: { meta, data },
      } = await api({
        url: "/voucher/generics",
        method: "get",
        params,
      });
      setData(data);
      setPagination((pagination) => {
        return {
          ...pagination,
          pageSize: meta.page_size,
          total: meta.total,
          current: meta.current_page,
        };
      });
    } catch (e) {
      e.response && message.error(e?.response?.data?.error?.msg);
    }
    setLoading(false);
  }
 const setNewData = (item,id) => {
   data.map((i,index) => i.id === id && (data[index] = {...data[index],...item}))
   setData(data)
   setFlag(!flag)
 }
  const columns = [
    {
      title: "CREATE & EXPIRY",
      render: (item) => (
        <div>
          C:{" "}
          {moment(item.create_time)
            .utc()
            .format("YYYY-MM-DD")}
          <br />
          E:{" "}
          {moment(item.end_time)
            .utc()
            .format("YYYY-MM-DD")}
        </div>
      ),
    },
    {
      title: "COUPON CODE",
      dataIndex: "voucher_code",
    },
    {
      title: "USED COUPON",
      render: (item) => (
        <div>
          Total: {item.used_count}
          <br />$ {(item.used_itc / 100).toFixed(2)}
        </div>
      ),
    },
    {
      title: "REMAIN NUMBER",
      render: (item) =>
        item.remain_number > -1 ? item.remain_number + " time(s)" : "Unlimited",
    },
    {
      title: "USAGE LIMIT",
      render: (item) =>
        item.user_use_number === -1 ? "Unlimited" : "One only",
    },
    {
      title: "STATUS",
      render: (item) =>
        ({
          0: "New application",
          1: "Available",
          2: "Unavailable",
          9: "Completed",
        }[item.status]),
    },
    {
      title: "VALUE (USD)	",
      render: (item) => (item.voucher_value / 100).toFixed(2),
    },
    {
      render: (item) => (
        <Button className="blue" type="text" onClick={(e) => handleViewEdit(e, item)} >
          View
        </Button>
      ),
    },
  ];
  const allSearch = [
    {
      title: "Account",
      type: "searchBySelect",
      postParam: "account_code",
      optionsArr: vtObj(voucherAccount)
    },
    {
      title: "Status",
      type: "searchBySelect",
      postParam: "status",
      optionsArr: [
        { v: 0, t: "New application" },
        { v: 1, t: "Available" },
        { v: 2, t: "Unavailable" },
        { v: 9, t: "Completed" },
      ],
    },
    {
      title: "Time Type",
      type: "searchByDatepickerWithSelect",
      postParam: ["min_at", "max_at", "min_st", "max_st", "min_et", "max_et"],
      defaultOption: 2,
      optionsArr: [
        { t: "Create Time", v: 0 },
        { t: "Start Time", v: 1 },
        { t: "End Time", v: 2 },
      ],
    },
  ];
  const handleTableChange = (page) => {
    setLoading(true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let { pageSize, current } = page;
    const { value } = code.current.state;
    getData({
      ...other.current.getValue(),
      voucher_code: value,
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setLoading(true);
    console.log(code);
    const { value } = code.current.state;
    getData({
      voucher_code: value,
      ...other.current.getValue(),
    });
  };
  const handleViewEdit = (e, item) => {
    e.stopPropagation()
    ViewEditRef.current.open(item)
  }
  const operations = (
    <div className="bg-white flex-end height-60">
      <Input className="width-250" placeholder="Coupon Code" ref={code} />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        className="margin-right-10 width-46"
        onClick={btnQuery}
      ></Button>
      <Button
        type="default"
        className={`${moreFilter === true ? "more-filter-button" : ""}  blue`}
        style={{ marginRight: "10px" }}
        icon={<FilterOutlined />}
        onClick={() => setMoreFilter((moreFilter) => !moreFilter)}
      >
        More Filter
      </Button>
    </div>
  );
  const allPage = (
    <div
      className="overflow-y-hidden overflow-x-hidden"
      style={{ marginTop: -5 }}
    >
      <Col
        className={`${
          moreFilter === true ? "gutter-example" : "display-none"
        } search-more`}
      >
        <div className="padding-5-10">
          <CommonSelects
            allSearch={allSearch}
            ref={other}
            search={(v) => {
              setLoading(true);
              const { value } = code.current.state;
              getData({
                voucher_code: value,
                ...v,
              });
            }}
          />
        </div>
      </Col>
      <Table
        className="margin-top-0 blue"
        columns={columns}
        key={flag}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        expandRowByClick
        onChange={handleTableChange}
        tableLayout="fixed"
        expandable={{
          expandedRowRender: (item) => (
            <MoreInformation
              objectArr={[
                { t: "ID", v: item.id },
                {
                  t: "ACCOUNT",
                  v: {
                    501: "Marketing Voucher Account",
                    209: "HR General Account",
                    203: "Service General Account",
                    120: "Technology General Account",
                    204: "Product General Account",
                  }[item.account_code],
                },
                {
                  t: "CONDITION TYPE",
                  v: voucherConditionJson(item.voucher_condition, item.voucher_value, item.condition_json)
                },
                {
                  t: "USED VOUCHERS",
                  v: (
                    <>
                      Total <strong>{item.used_count || 0}</strong> Vouchers,
                      <strong>{item.used_itc}</strong> USD
                    </>
                  ),
                },
                {
                  t: "VALIDITY PERIOD (UTC)",
                  v: (
                    <>
                      {moment(item.start_time)
                        .utc()
                        .format("YYYY-MM-DD HH:mm")}{" "}
                      to{" "}
                      {moment(item.end_time)
                        .utc()
                        .format("YYYY-MM-DD HH:mm")}
                    </>
                  ),
                },
                {
                  t: "CREATE TIME (UTC)",
                  v: moment(item.create_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm"),
                },
                { t: "CONDITION JSON", v: item.condition_json, position: 2 },
              ]}
            />
          ),
          expandedRowKeys:rowKeys,
          onExpandedRowsChange:e=>setRowKeys(e)
        }}
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white">
        {operations}
        {allPage}
        <GenericCoupon ref={GrnrricCouponRef} freshList={() => setFresh(!fresh)} />
        <ViewEdit ref={ViewEditRef} setData={setNewData} />
      </div>
    </Spin>
  );
};

export default GenericCouponList;

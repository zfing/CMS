import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Table,
  message,
  Spin
} from "antd";
import {
  FilterOutlined,
  SearchOutlined
} from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import InputWithSelect from "../../../components/CommonComponent/InputWithSelect.tsx";
import api from "../../../components/Api";
import moment from "moment";
import qs from "qs";
import MoreInformation from "../../../components/CommonComponent/MoreInformation";
import Detail from "./Detail";
import {
  voucherAccount,
  allVoucherAccounts,
  conditionType,
  voucherConditionJson
} from "../CommonConst";
import { vtObj } from "../../../components/CommonComponent/CommonFunction";

const VoucherList = (props) => {
  let { voucherid } = qs.parse(props.location.search.substr(1));
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
  const userId = useRef(null);
  const other = useRef(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [item, setItem] = useState({});
  const [rowKeys, setRowKeys] = useState([]);

  useEffect(() => {
    getData({ voucher_id: voucherid });
  }, [voucherid]);
  async function getData(params) {
    setRowKeys([]);
    try {
      let {
        data: { meta, data },
      } = await api({
        url: "/voucher/voucher-list",
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
  const columns = [
    {
      title: <span style={{ fontSize: 13 }}>CREATE/EXPIRY TIME</span>,
      width: '15%',
      columnTitle: "white",
      render: (item) => (
        <div>
          C:
          {moment(item.create_time).utc().format("YYYY-MM-DD HH:mm")}
          <br />
          E:
          {moment(item.end_time).utc().format("YYYY-MM-DD")}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>ACCOUNT</span>,
      columnTitle: "white",
      width: '15%',
      render: (item) => allVoucherAccounts[item.account_code],
    },
    {
      title: "CAMPAIGN NAME",
      columnTitle: "white",
      width: '10%',
      render: (item) => item.voucher_category_code || item.generic_name,
    },
    {
      title: <span style={{ fontSize: 13 }}>CONDITION TYPE</span>,
      columnTitle: "white",
      width: '20%',
      render: (item) => conditionType[item?.voucher_condition],
    },
    {
      title: <span style={{ fontSize: 13 }}>STATUS</span>,
      columnTitle: "white",
      width: '10%',
      render: (item) =>
        ({
          0: "Unused",
          1: "Used",
          2: "Using",
          3: "Expired",
          4: "Delay Using",
          9: "Canceled",
        }[item.voucher_status]),
    },
    {
      title: <span style={{ fontSize: 13 }}>USER</span>,
      columnTitle: "white",
      dataIndex: 'user_id',
      width: '10%',
    },
    {
      title: "VALUE (USD)",
      width: '10%',
      render: (item) =>
        item.voucher_value && (item.voucher_value / 100).toFixed(2),
    },
    {  
      width: '10%',
      render: (item) =>
        item.voucher_category_code && (
          <Button
            className="blue"
            type="text"
            onClick={(e) => {
              e.stopPropagation()
              setItem(item);
              setDetailVisible(true);
            }}
          >
            View
          </Button>
        ),
    },
  ];
  const allSearch = [
    {
      title: "Campaign Code",
      type: "searchByInput",
      postParam: "category_code",
    },
    {
      title: "Account",
      type: "searchBySelect",
      postParam: "account_code",
      optionsArr: vtObj(voucherAccount),
    },
    {
      title: "Voucher Type",
      type: "searchBySelect",
      postParam: "voucher_type",
      optionsArr: [
        {
          t: "Unique Code Voucher",
          v: "1",
        },
        {
          t: "Generic Code Voucher",
          v: "2",
        },
      ],
    },
    {
      title: "Status",
      type: "searchBySelect",
      postParam: "status",
      optionsArr: [
        { t: "Unused", v: "0" },
        { t: "Used", v: "1" },
        { t: "Using", v: "2" },
        { t: "Expired", v: "3" },
        { t: "Delay Using", v: "4" },
        { t: "Canceled", v: "9" },
      ],
    },
    {
      title: "Use User",
      type: "searchByInput",
      postParam: "user",
      placeholder: "ID/Email",
    },
    {
      title: "Used Object",
      type: "searchByInput",
      postParam: "use_object",
      placeholder: "eg: VC8756766295",
    },
    {
      title: "Condition Type",
      type: "searchBySelect",
      postParam: "condition",
      optionsArr: [
        { v: 1, t: "Redeem USD Directly" },
        { v: 2, t: "Buy $x get x USD Credits for free" },
        { v: 3, t: "Buy $x get $x off" },
      ],
    },
    {
      title: "Time Type",
      type: "searchByDatepickerWithSelect",
      defaultOption: 2,
      postParam: ["min_at", "max_at", "min_st", "max_st", "min_et", "max_et"],
      optionsArr: [
        { v: 0, t: "Create Time" },
        { v: 1, t: "Start Time" },
        { v: 2, t: "End Time" },
      ],
    },
  ];
  const handleTableChange = (page) => {
    setLoading(true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let { pageSize, current } = page;
    getData({
      [userId.current.data.key]: userId.current.data.value,
      ...other.current.getValue(),
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setLoading(true);
    getData({
      [userId.current.data.key]: userId.current.data.value,
      ...other.current.getValue(),
    });
  };
  const operations = (
    <div className="bg-white flex-end height-60">
      <InputWithSelect
        hasVoucherId={voucherid}
        defaultValue={voucherid ? "voucher_id" : "voucher_code"}
        options={[
          {
            label: "Voucher Code",
            value: "voucher_code",
            placeholder: "Search by Voucher Code",
          },
          {
            label: "Voucher ID",
            value: "voucher_id",
            placeholder: "Search by Voucher ID",
          },
        ]}
        inputValue={qs.parse(props.location.search.substr(1)).voucherid || ""}
        ref={userId}
      />
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
              getData({
                [userId.current.data.key]: userId.current.data.value,
                ...v,
              });
            }}
          />
        </div>
      </Col>
      <Table
        className="margin-top-0 blue"
        columns={columns}
        // rowClassName='table-hover-pointer'
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
                { t: "VOUCHER CODE", v: item.voucher_code },
                {
                  t: "CONDITION TYPE",
                  v: voucherConditionJson( item.voucher_condition, item.voucher_value, item.condition_json)
                },
                {
                  t: "VALIDITY PERIOD (UTC)",
                  v: `${moment(item.start_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")} to ${moment(item.end_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")}`,
                },
                {
                  t: "USED INFO",
                  v: `User: ${item.user_id ?? ""} | Time: ${
                    moment(item.use_date).utc().format("YYYY-MM-DD HH:mm") ?? ""
                  } | Object: ${item.use_object ?? ""}`,
                  position: 2,
                },
                { t: "CONDITION JSON", v: item.condition_json, position: 2 },
              ]}
            />
          ),
          expandedRowKeys: rowKeys,
          onExpandedRowsChange: (e) => setRowKeys(e),
        }}
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white" id="Hackusermissions">
        {operations}
        {allPage}
        <Detail
          visible={detailVisible}
          item={item}
          onCancel={() => {
            setDetailVisible(false);
          }}
        />
      </div>
    </Spin>
  );
};

export default VoucherList;

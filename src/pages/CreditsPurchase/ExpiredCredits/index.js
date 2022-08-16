import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Table,
  notification,
  Spin,
  Select,
  message,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined
} from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import InputWithSelect from "../../../components/CommonComponent/InputWithSelect.tsx";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { get_list_log_submit } from "./service";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";
import { WalletType } from "../../Wallet/WalletConst";
import "../creditsPurchase.css";

const { Option } = Select
const ExpiredCredits = (props) => {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [moreFilter, setMoreFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({ data: [], meta: { total: 0 } });
  const userId = useRef(null);
  const other = useRef(null);
  // const [queryData, setQueryData] = useState({});
  const [walletValue, setWalletValue] = useState('');
  const [curItem, setCurItem] = useState({});
  const [fresh, setFresh] = useState(false);
  const detailRef = useRef(null);
  const [logModal, setLogModal] = useState(false);
  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh]);
  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = {
      ...searchParams,
      wallet_type: walletValue,
      [userId.current.data.key]: userId.current.data.value,
      ...other?.current?.getValue()
    };
    get_list_log_submit(params)
      .then((res) => {
        const { data } = res;
        setResult(data);
        setPagination((pagination) => {
          return {
            ...pagination,
            pageSize: data?.meta?.page_size,
            total: data?.meta?.total,
            current: data?.meta?.current_page,
          };
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Cannot get data",
        });
      })
      .finally((_) => setLoading(false));
  };
  const columns = [
    {
      title: <span style={{ fontSize: 13 }}>DATE(UTC)</span>,
      width: "20%",
      columnTitle: "white",
      render: (item) => commonFilter("fDate", item.create_time),
    },
    {
      title: <span style={{ fontSize: 13 }}>ORDER ID</span>,
      columnTitle: "white",
      width: "15%",
      dataIndex: "order_id",
    },
    {
      title: <span style={{ fontSize: 13 }}>USER ID</span>,
      columnTitle: "white",
      width: "10%",
      render: (item) => (
        <span
          className="blue link-hover-underline"
          onClick={(e) => {
            e.stopPropagation();
            detailRef?.current?.open(item.account_id);
          }}
        >
          {item.account_id}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>WALLET</span>,
      columnTitle: "white",
      width: "15%",
      render: (item) => WalletType(item.wallet_type, 1),
    },
    {
      title: <span style={{ fontSize: 13 }}>AMOUNT(USD)</span>,
      columnTitle: "white",
      width: "20%",
      render: (item) => commonFilter("centToUsd", item.trans_amount),
    },
    {
      title: <span style={{ fontSize: 13 }}>IS UNDO</span>,
      columnTitle: "white",
      width: "10%",
      render: (item) => (item.undo_flag ? "YES" : "No"),
    },
    {
      // width: "10%",
      render: (item) =>
        HasPermi(1001201) &&
        !item.undo_flag && (
          <span
            className="blue link-hover-underline"
            onClick={(e) => {
              setCurItem(item)
              e.stopPropagation();
              logModal.onShow()
            }}
          >
            Undo
          </span>
        ),
    },
  ];
  const allSearch = [
    {
      title: "Undo Flag",
      type: "searchBySelect",
      postParam: "undo_flag",
      optionsArr: [
        {v: '0', t:'Not Undone'}, 
        {v: '1', t: 'Undone'}
      ],
    },
    {
      title: "Time",
      type: "searchByDatepicker",
      minPostParam: "min_ct",
      maxPostParam: "max_ct",
    },
  ];
  const handleTableChange = (page) => {
    setLoading(true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let { pageSize, current } = page;
    fetch({
      [userId.current.data.key]: userId.current.data.value,
      ...other.current.getValue(),
      wallet_type: walletValue,
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setLoading(true);
    fetch({
      wallet_type: walletValue,
      [userId.current.data.key]: userId.current.data.value,
      ...other.current.getValue(),
    });
  };
  const submit = (log_note) => {
    let postData = {
      log_note,
      id: curItem.id,
      user_id: curItem.account_id,
    };

    get_list_log_submit(postData, "post")
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        setFresh(!fresh);
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const operations = (
    <div className="bg-white flex-end height-60">
      <InputWithSelect
        // hasVoucherId={voucherid}
        defaultValue={"user"}
        options={[
          {
            label: "User",
            value: "user",
            placeholder: "Search by User ID/Email",
          },
          {
            label: "Transaction",
            value: "order_id",
            placeholder: "Search by Transaction ID",
          },
        ]}
        // inputValue={qs.parse(props.location.search.substr(1)).voucherid || ""}
        ref={userId}
      />
      <Select
        defaultValue={''}
        onChange={(v) => setWalletValue(v)}
      >
        <Option value=''>Wallet Type</Option>
        <Option value='0'>Wallet: Student</Option>
        <Option value='1'>Wallet: Teacher</Option>
      </Select>
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
            search={(value) => {
              setPagination({ ...pagination, current: 1, page: 1 });
              // setQueryData(value);
              setFresh(!fresh);
            }}
            ref={other}
            allSearch={allSearch}
          />
        </div>
      </Col>
      <Table
        className="margin-top-0 blue"
        columns={columns}
        rowClassName="table-hover-pointer"
        dataSource={result.data}
        rowKey="id"
        expandRowByClick
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{
          ...pagination,
          total: result.meta?.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items | Amount: $${commonFilter(
              "centToUsd",
              result.meta.sum_amount
            )} USD`}</span>
          ),
        }}
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white" id="Hackusermissions">
        {operations}
        {allPage}
        <Detail type="AccountWallet" ref={detailRef} />
        <WriteLog
          title={`Undo expired credits: ${curItem.order_id}`}
          onOk={submit}
          tips={`Undo amount ${commonFilter('centToUsd', curItem.trans_amount)} USD`}
          onRef={(ref) => setLogModal(ref)}
        />
      </div>
    </Spin>
  );
};
export default ExpiredCredits;

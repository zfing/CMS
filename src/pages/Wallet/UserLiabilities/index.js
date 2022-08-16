import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Table,
  Input,
  Row,
  Col,
  notification,
  Select,
  Menu,
  Dropdown,
  Tooltip,
  message
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { get_list, log_submit } from "./service";
import { WalletLiabilitiesDesc, WalletLiabilities } from "../WalletConst";
import "../wallet.css";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import AddLiabilities from "./modals/AddLiabilities";
import LiabilitiesLog from "./modals/LiabilitiesLog";
import PayingOff from "./modals/PayingOff";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";

const { Option } = Select;
const UserLiabilities = () => {
  const [moreFilter, setMoreFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tempData, setTempData] = useState({});
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [curItem, setCurItem] = useState({});
  const [queryData, setQueryData] = useState({});
  const [desc, setDesc] = useState("create_time");
  const [fresh, setFresh] = useState(false);
  const [searchValue, setSearch] = useState({});
  const [logKey, setLogKey] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [logValues, setLogValues] = useState({
    id: null,
    title: "",
  });
  const addLiabilities = useRef(null);
  const detailRef = useRef(null);
  const other = useRef(null);
  const logRef = useRef(null);
  const payingRef = useRef(null);
  const inputSearchRef = useRef(null);

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...searchValue,
      ...queryData,
      sort_column: desc,
    });
  }, [pagination, searchValue, queryData, desc, fresh]);
  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    const searchObj = { user: inputSearchRef?.current?.state?.value };
    let params = {
      ...searchParams,
      ...other?.current?.getValue(),
      ...searchObj,
    };
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
  const btnQuery = () => {
    setSearch({user: inputValue});
  };

  const confiscateCredits = (item) => {
    const { key, domEvent } = item;
    setLogValues({ ...logValues, title: domEvent.target.innerText });
    setLogKey(key);
    addLiabilities.current.open(domEvent.target.innerText);
  };
  const Actions = (obj, item) => {
    setCurItem(item);
    const { key } = obj;
    setLogKey(key);
    if(key === '1') {
      logRef.current.open();
    } else {
      const t = `Paying Off ${key === '2' ? 'Student' : 'Teacher'} (${item?.user_id}) Debts`
      setLogValues({
        ...logValues,
        title: t,
      });
      payingRef.current.open(key, t);
    }
  };
  const tableColumns = [
    {
      title: "USER ID",
      key: "user_id",
      width: "10%",
      render: (item) => (
        <span
          className="blue link-hover-underline"
          onClick={() => detailRef?.current?.open(item.user_id)}
        >
          {item.user_id}
        </span>
      ),
    },
    {
      title: "LIABILITIES (USD)",
      key: "negative",
      width: "15%",
      render: (item) => (
        <>
          <span className={item.negative_sv > 0 ? "color-red" : ""}>
            S: {commonFilter("centToUsd", item.negative_sv)}
          </span>
          <br />
          <span className={item.negative_tv > 0 ? "color-red" : ""}>
            T: {commonFilter("centToUsd", item.negative_tv)}
          </span>
        </>
      ),
    },
    {
      title: "AVAILABLE BALANCE (USD)",
      key: "stv",
      width: "20%",
      render: (item) => (
        <>
          <span>S: {commonFilter("centToUsd", item.sv_)}</span>
          <br />
          <span>T: {commonFilter("centToUsd", item.tv_)}</span>
        </>
      ),
    },
    {
      title: "CREATE / UPDATE TIME",
      key: "time",
      width: "25%",
      render: (item) => (
        <>
          <span>C: {commonFilter("fDate", item.create_time)}</span>
          <br />
          <span>U: {commonFilter("fDate", item.update_time)}</span>
        </>
      ),
    },
    {
      title: "REMARK",
      key: "remark",
      width: "20%",
      render: (item) => <span className="word-break">{item.remark}</span>,
    },
    {
      width: "10%",
      key: "actions",
      render: (item) => {
        const menu = () => (
          <Menu
            className="dropdown-button"
            style={{ width: "100%" }}
            onClick={(obj) => Actions(obj, item)}
          >
            <Menu.Item
              key="1"
              onClick={(e) => {
                e.domEvent.stopPropagation();
              }}
            >
              Liabilities Log
            </Menu.Item>
            {item.negative_sv > 0 && HasPermi(1002701) && (
              <Menu.Item
                key="2"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                Paying off Student debts
              </Menu.Item>
            )}
            {item.negative_tv > 0 && HasPermi(1002701) && (
              <Menu.Item
                key="3"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                Paying off Teacher debts
              </Menu.Item>
            )}
          </Menu>
        );
        return (
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
        );
      },
    },
  ];
  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };
  const confirm = (log_note) => {
    let postData = { ...tempData, log_note };
    if(['S','2'].includes(logKey)) {
      Reflect.set(postData, "wallet_type", 0);
    } else if(['T','3'].includes(logKey)) {
      Reflect.set(postData, "wallet_type", 1);
    } 
    if(['2', '3'].includes(logKey)) {
      Reflect.set(postData, "operate", 'paying_off_debts');
      Reflect.set(postData, "has_deduct_user_itc", 0);
    }
    log_submit(postData, "post", logValues?.id)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        addLiabilities?.current?.cancel();
        payingRef.current.cancel()
        setFresh(!fresh);
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const BarMenu = () => (
    <Menu
      className="dropdown-button"
      style={{ width: "100%" }}
      onClick={confiscateCredits}
    >
      {WalletLiabilities.map(
        (item) =>
          HasPermi(item.per) && (
            <Menu.Item
              key={item.key}
              onClick={(e) => {
                e.domEvent.stopPropagation();
              }}
            >
              {item.name}
            </Menu.Item>
          )
      )}
    </Menu>
  );
  const operations = (
    <Row className="color-white search-bar">
      <Col
        className="display-flex"
        span={24}
        style={{ justifyContent: "flex-end", alignItems: "center" }}
      >
        <Input
          className="width-200 margin-0"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="User ID / Email"
          ref={inputSearchRef}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="width-46"
          onClick={btnQuery}
        />
        <Button
          type="default"
          className={`${
            moreFilter === true ? "more-filter-button margin-l-r-10" : ""
          } blue margin-0-10`}
          icon={<FilterOutlined />}
          onClick={() => setMoreFilter(!moreFilter)}
        >
          More Filter
        </Button>
        <Select
          style={{ width: "20%", marginRight: 10 }}
          defaultValue="create_time"
          onChange={(v) => setDesc(v)}
        >
          {WalletLiabilitiesDesc.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.desc}
            </Option>
          ))}
        </Select>
        <Dropdown
          overlay={BarMenu()}
          trigger={["click"]}
          placement="bottomRight"
          className="margin-right-10"
        >
          <Tooltip
            title={"More actions"}
            overlayStyle={{ whiteSpace: "nowrap" }}
          >
            <Button
              onClick={(e) => e.stopPropagation()}
              type="default"
              shape="circle"
              icon={<MoreOutlined />}
            ></Button>
          </Tooltip>
        </Dropdown>
      </Col>
    </Row>
  );
  const allSeslect = (
    <>
      {moreFilter && (
        <Col
          className={`${
            moreFilter === true ? "gutter-example" : "display-none"
          } search-more`}
        >
          <CommonSelects
            search={(value) => {
              const values = { liabilities_type: 9, ...value };
              setPagination({ ...pagination, current: 1, page: 1 });
              setQueryData(values);
            }}
            ref={other}
            allSearch={[
              {
                type: "searchBySelect",
                title: "Wallet Liabilities Type",
                postParam: "liabilities_type",
                optionsArr: [
                  { v: 9, t: "Student / Teacher Liabilities Wallet" },
                  { v: 0, t: "Student Liabilities Wallet" },
                  { v: 1, t: "Teacher Liabilities Wallet" },
                ],
                defaultValue: 9,
              },
              {
                type: "searchBySelect",
                title: "Wallet Available Balance Type",
                optionsArr: [
                  { v: 0, t: "Student wallet has available balance" },
                  { v: 1, t: "Teacher wallet has available balance" },
                ],
                postParam: "wallet_available_type",
              },
            ]}
          />
        </Col>
      )}
    </>
  );
  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      {allSeslect}
      <Table
        className="margin-top-0 blue Table"
        columns={tableColumns}
        dataSource={resultObj.data}
        rowKey="userLiabilitiesID"
        loading={loading}
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items | Student Liabilities: $${commonFilter(
              "centToUsd",
              resultObj.meta.sum_negative_sv
            )} USD | Teacher Liabilities: $${commonFilter(
              "centToUsd",
              resultObj.meta.sum_negative_tv
            )} USD`}</span>
          ),
        }}
        expandRowByClick
        onChange={handleTableChange}
      ></Table>
      <AddLiabilities
        submit={() => {
          logModal.onShow();
        }}
        onData={(data, id) => {
          setTempData(data);
          setLogValues({ ...logValues, id });
          logModal.onShow();
        }}
        ref={addLiabilities}
      />
      <Detail type="AccountWallet" ref={detailRef} />
      <LiabilitiesLog ref={logRef} curID={curItem?.user_id} />
      <PayingOff
        ref={payingRef}
        curItem={curItem}
        onData={(data, id) => {
          setTempData(data)
          setLogValues({ ...logValues, id });
          logModal.onShow();
        }}
      />
      <WriteLog
        title={logValues?.title}
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
      />
    </div>
  );
};

export default UserLiabilities;

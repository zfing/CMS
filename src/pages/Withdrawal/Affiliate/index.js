import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Table,
  notification,
  Spin,
  Dropdown,
  Tooltip,
  Menu,
  Row,
  Timeline,
  message,
  Select,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  MoreOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import InputWithSelect from "../../../components/CommonComponent/InputWithSelect.tsx";
import moment from "moment";
import axios from "axios";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { vtPaymentConfig } from "../../../components/CommonComponent/CommonFunction";
import { vtObj } from "../../../components/CommonComponent/CommonFunction";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { get_list_log_submit, edit_expandable_cash } from "./service";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";
import UploadFile from "./modal/UploadFile";
import CSVDownload from "../../../components/CommonComponent/CSVDownloadModal/CSVDownloadModal";
import WithdrawDetail from "./modal/WithdrawDetail";
import CompleteWithdrawal from "./modal/CompleteWithdrawal";
import Withdrawal from "../../Vourcher/GiftcardsPurchase/modal/Withdrawal";
import BatchApprove from "./modal/BatchApprove";
import {
  TWithdrawDesc,
  AWithdrawOperations,
  timeType,
  WithdrawStatus,
  WithdrawMethod,
  AWithdrawListOperations,
  AdownloadData,
} from "../WithdrawalConst";
import "../withdrawal.css";

const { Option } = Select;
const Affiliate = (props) => {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [moreFilter, setMoreFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [desc, setDesc] = useState("create_time");
  const [curItem, setCurItem] = useState({});
  const [fresh, setFresh] = useState(false);
  const [rowKeys, setRowKeys] = useState([]);
  const [logModal, setLogModal] = useState(false);
  const [viewRowkeys, setViewRowkeys] = useState(false);
  const [downVisible, setDownVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [logType, setLogType] = useState({ title: "", type: null });
  const [downloadParams, setDownloadParams] = useState({});
  const uploadRef = useRef(null);
  const cashPaidRef = useRef(null);
  const detailRef = useRef(null);
  const WithdrawDetailRef = useRef(null);
  const searchValue = useRef(null);
  const other = useRef(null);
  const completeWithdrawalRef = useRef(null);
  const withdrawalRef = useRef(null);
  const batchApproveRef = useRef(null);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh, desc]);
  const fetch = (searchParams, componentAttribute) => {
    setRowKeys([]);
    setSelectedRowKeys([]);
    setLoading(true);
    let params = {
      ...searchParams,
      [searchValue.current.data.key]: searchValue.current.data.value,
      ...other?.current?.getValue(),
      sort_column: desc,
    };
    setDownloadParams(params);
    get_list_log_submit(params)
      .then((res) => {
        const {
          data: { data, meta },
        } = res;
        setData(data);
        setMeta(meta);
        setPagination((pagination) => {
          return {
            ...pagination,
            pageSize: meta?.page_size,
            total: meta?.total,
            current: meta?.current_page,
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
      title: <span style={{ fontSize: 13 }}>WITHDRAWAL TIME</span>,
      columnTitle: "white",
      width: '20%',
      render: (item) => <span>{commonFilter("fDate", item.create_time)}</span>
    },
    {
      title: <span style={{ fontSize: 13 }}>ORDER ID</span>,
      columnTitle: "white",
      width: '15%',
      dataIndex: "order_id",
    },
    {
      title: <span style={{ fontSize: 13 }}>AFFILIATE ID</span>,
      columnTitle: "white",
      width: '10%',
      render: (item) => (
        <span
          className="blue link-hover-underline"
          onClick={(e) => {
            e.stopPropagation();
            detailRef?.current?.open(item.user_id);
          }}
        >
          {item.user_id}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>METHOD</span>,
      columnTitle: "white",
      width: '15%',
      render: (item) => (
        <>
          <span>{commonFilter("payType", item.account_type)}</span>
          <br />
          <span>{item.account}</span>
        </>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>STATUS</span>,
      columnTitle: "white",
      width: '15%',
      render: (item) => commonFilter("withdrawStatus", item.status),
    },
    {
      title: <span style={{ fontSize: 13 }}>AMOUNT (USD)</span>,
      width: '15%',
      render: (item) => commonFilter("centToUsd", item.amount),
    },
    {
      width: '10%',
      render: (item) => {
        const menu = () => (
          <Menu
            className="dropdown-button"
            style={{ width: "100%" }}
            onClick={(obj) => Actions(obj, item)}
          >
            {AWithdrawListOperations.map((list) => {
              let currentPer = false;
              switch (list.key) {
                case "1":
                  currentPer = item.status === 0;
                  break;
                case "2":
                  currentPer = item.status === 0;
                  break;
                case "3":
                  currentPer = item.status === 1;
                  break;
                case "4":
                  currentPer = [1, 7].includes(item.status);
                  break;
                case "5":
                  currentPer = item.status === 1;
                  break;
                case "7":
                  currentPer = true;
                  break;
                case "8":
                  currentPer =
                    item.status === 7 && [30, 31].includes(item.account_type);
                  break;
                default:
                  return null;
              }
              return (
                currentPer &&
                (list.per ? HasPermi(list.per) : true) && (
                  <Menu.Item
                    key={list.key}
                    onClick={(e) => {
                      e.domEvent.stopPropagation();
                    }}
                  >
                    {list.name}
                  </Menu.Item>
                )
              );
            })}
          </Menu>
        );
        return (
          [0, 1, 2, 7].includes(item.status) && (
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
  const Actions = (obj, item) => {
    setCurItem(item);
    const { key } = obj;
    switch (key) {
      case "1":
        setLogType({ title: "Approve Application Withdrawal", type: key });
        logModal.onShow();
        break;
      case "2":
        setLogType({ title: "Reject Application Withdrawal", type: key });
        logModal.onShow();
        break;
      case "3":
        setLogType({ title: "Cash Paid", type: key });
        logModal.onShow();
        break;
      case "4":
        completeWithdrawalRef.current.open();
        break;
      case "5":
        setLogType({ title: "Cancel Withdrawal", type: key });
        logModal.onShow();
        break;
      case "7":
        WithdrawDetailRef.current.open();
        break;
      case "8":
        const postData = {
          event:
            item.account_type === 31
              ? "paymentfunded"
              : "paymentrequestacceptedbybank",
          payeeid: item.user_id,
          withdrawid: item.order_id,
          payoneerpaymentid: 0,
        };
        checkPayoneer(postData);
        break;
      default:
        return null;
    }
  };
  const checkPayoneer = (data) => {
    axios
      .post(
        `${process.env.REACT_APP_TEACHER_URL}finance/withdraw/ipcn-payoneer`,
        data
      )
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && setFresh(!fresh);
      })
      .catch((err) => {
        message.error(err?.response?.data.error.code);
      });
  };
  const allSearch = [
    {
      title: "Status",
      type: "searchBySelect",
      postParam: "status",
      optionsArr: WithdrawStatus.filter(item => item.v !== '6'),
      callBack: (v) => {
        setSelectStatus(v);
      },
    },
    {
      title: "Withdraw Method",
      type: "searchBySelect",
      postParam: "account_type",
      optionsArr: vtPaymentConfig(
        JSON.parse(localStorage.getItem("paymentConfig")).filter((item) =>
          WithdrawMethod.includes(item.pay_type)
        )
      ),
    },
    {
      title: "Withdrawal amount",
      type: "searchByRange",
      toCent: true,
      maxPostParam: "max_amount",
      minPostParam: "min_amount",
    },
    {
      title: "Time Type",
      optionsArr: vtObj(timeType),
      type: "searchByDatepickerWithSelect",
      defaultOption: "0",
      postParam: ["min_ct", "max_ct", "min_ft", "max_ft"],
    },
  ];
  const handleTableChange = (page) => {
    setLoading(true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let { pageSize, current } = page;
    fetch({
      [searchValue.current.data.key]: searchValue.current.data.value,
      ...other.current.getValue(),
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setViewRowkeys(["0"].includes(selectStatus) ? true : false);
    setLoading(true);
    fetch({
      [searchValue.current.data.key]: searchValue.current.data.value,
      ...other.current.getValue(),
    });
  };
  const submit = (log_note) => {
    let formData = new FormData();
    if ([1, 2].includes(logType.type)) {
      selectedRowKeys.map((item) => formData.append("withdraw_id", item));
      formData.append("log_note", log_note);
    }
    let postData = { log_note };
    let flag = null;
    if ([1, 2].includes(logType.type)) {
      flag = 1;
    } else if (["1", "2", "3", "5"].includes(logType.type)) {
      flag = 2;
    }

    switch (logType.type) {
      // type 数字1，2为下方操作；字符串‘1’，‘2’...为列表右侧操作；字符串‘B1’，‘B2’...为上方TabBar右侧操作
      case 1:
        formData.append("operate", "batch_accept");
        break;
      case 2:
        formData.append("operate", "batch_reject");
        break;
      case "1":
        Reflect.set(postData, "operate", "accept");
        break;
      case "2":
        Reflect.set(postData, "operate", "reject");
        break;
      case "3":
        Reflect.set(postData, "operate", "accept_pay");
        break;
      case "5":
        Reflect.set(postData, "operate", "accept_cancel");
        break;
      default:
        return null;
    }
    let p =
      flag === 1
        ? get_list_log_submit(formData, "post", { dataType: "form" })
        : edit_expandable_cash(postData, "post", curItem.id);
    p.then((res) => {
      const {
        data: {
          data: { success },
        },
      } = res;
      success && message.success("Success");
      logModal.onCancel();
      setFresh(!fresh);
    }).catch((err) => message.error(err?.error?.msg));
  };
  const confiscateCredits = (item) => {
    const { key, domEvent } = item;
    setLogType({ title: domEvent.target.innerText, type: key });
    switch (key) {
      case "B1":
        setDownVisible(true);
        break;
      case "B2":
        uploadRef.current.open();
        break;
      case "B3":
        withdrawalRef.current.open('1');
        break;
      default:
        return null;
    }
  };
  const BarMenu = () => (
    <Menu
      className="dropdown-button"
      style={{ width: "100%" }}
      onClick={confiscateCredits}
    >
      {AWithdrawOperations.map(
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
    <div className="bg-white flex-end height-60">
      <InputWithSelect
        defaultValue={"order_id"}
        options={[
          {
            label: "Order ID",
            value: "order_id",
            placeholder: "Search by Order ID",
          },
          {
            label: "Affiliate",
            value: "user",
            placeholder: "Search by Affiliate",
          },
          {
            label: "Withdraw Account",
            value: "account",
            placeholder: "Search by Withdraw Account",
          },
        ]}
        ref={searchValue}
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
      <Select
        style={{ width: "20%" }}
        className="margin-l10-r10"
        defaultValue="create_time"
        onChange={(v) => setDesc(v)}
      >
        {TWithdrawDesc.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.desc}
          </Option>
        ))}
      </Select>
      {HasPermi(1003201) && <Dropdown
        overlay={BarMenu()}
        trigger={["click"]}
        placement="bottomRight"
        className="margin-right-10"
      >
        <Tooltip title={"More actions"} overlayStyle={{ whiteSpace: "nowrap" }}>
          <Button
            onClick={(e) => e.stopPropagation()}
            type="default"
            shape="circle"
            icon={<MoreOutlined />}
          ></Button>
        </Tooltip>
      </Dropdown>}
    </div>
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
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
              setViewRowkeys(["0"].includes(selectStatus) ? true : false);
              setPagination({ ...pagination, current: 1, page: 1 });
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
        dataSource={data}
        rowKey="id"
        expandRowByClick
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{
          ...pagination,
          total: meta?.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items | Amount: $${commonFilter(
              "centToUsd",
              meta.sum_amount
            )} USD`}</span>
          ),
        }}
        onExpand={(expanded, record) => {
          if (expanded && !record.expanded) {
            // 是否展开过
            edit_expandable_cash(null, null, record.id).then((res) => {
              const {
                data: { data: detailData },
              } = res;
              setData(() =>
                data.map((item) =>
                  item.id === detailData.id
                    ? { ...item, ...detailData, expanded: true, arrow: false }
                    : item
                )
              );
            });
          }
        }}
        expandable={{
          expandedRowRender: (item) => {
            return (
              <>
                {/* {[2, 6].indexOf(item.status) > -1 && (
                  <Row>
                    <div className="expandable-title">
                      <Col span={23}>
                        <h4>WITHDRAW INFO</h4>
                      </Col>
                    </div>
                    {WithdrawInfo(item)}
                  </Row>
                )} */}

                {[0, 3].includes(item.account_type) && item.account_comment && (
                  <Row className="padding-left-10">
                    <Col span={23}>
                      <h4>ACCOUNT OTHER INFO</h4>
                    </Col>
                    {OtherInfo(JSON.parse(item.account_comment))}
                  </Row>
                )}
                <Row style={{ border: "solid 1px #ccc" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      backgroundColor: "#d3d3d3",
                      paddingLeft: 10,
                      alignItems: "baseline",
                    }}
                  >
                    <Col
                      span={23}
                      onClick={() => {
                        setData(() =>
                          data.map((obj) =>
                            obj.id === item.id
                              ? { ...obj, arrow: !obj.arrow }
                              : obj
                          )
                        );
                      }}
                    >
                      <h4>HISTORY</h4>
                    </Col>
                    <Button
                      type="text"
                      icon={item.arrow ? <UpOutlined /> : <DownOutlined />}
                    ></Button>
                  </div>
                  {item.arrow ? (
                    <Timeline mode="left" style={{ marginTop: 20 }}>
                      {item?.withdrawhis_obj_s?.map((item) => (
                        <Timeline.Item
                          key={item.status}
                          color={
                            {
                              0: "orange",
                              1: "orange",
                              2: "green",
                              3: "red",
                              4: "red",
                              5: "red",
                              6: "red",
                              7: "orange"
                            }[item.status]
                          }
                          label={moment(item.update_time)
                            .utc()
                            .format("YYYY-MM-DD HH:mm")}
                          style={{
                            width: 800,
                            marginLeft: -200,
                            color: {
                              0: "orange",
                              1: "orange",
                              2: "green",
                              3: "red",
                              4: "red",
                              5: "red",
                              6: "red",
                              7: "orange"
                            }[item.status],
                          }}
                        >
                          <div>
                            <span>
                              Status:
                              {commonFilter("withdrawStatus", item?.status)} |&nbsp;
                              {[1, 2].indexOf(item?.status) > -1 && (
                                <span>
                                  withdraw type：
                                  {commonFilter(
                                    "withdrawType",
                                    item?.withdraw_type
                                  )}{" "}
                                  |{" "}
                                </span>
                              )}
                              Admin：
                              {item.admin_name ? item.admin_name : "payee"}
                            </span>
                          </div>
                          {item.admin_comment && (
                            <span>Comment：{item.admin_comment}</span>
                          )}
                          {/* <span>Update Time: {commonFilter('fDate', item.update_time)}</span> */}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <div style={{ color: "#fb6e52", margin: 10 }}>
                      Currently, This transaction status is{" "}
                      {item.withdrawhis_obj_s instanceof Array && (
                        <>
                          <span className="text-bold-7">
                            {`${commonFilter(
                              "withdrawStatus",
                              item?.withdrawhis_obj_s[0]?.status
                            )}`}
                          </span>
                          , &nbsp;
                          <span>
                            {`in ${commonFilter(
                              "fDate",
                              item?.withdrawhis_obj_s[0]?.update_time
                            )}`}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </Row>
              </>
            );
          },
          expandedRowKeys: rowKeys,
          onExpandedRowsChange: (e) => setRowKeys(e),
        }}
        rowSelection={viewRowkeys && rowSelection}
      />
    </div>
  );

  const OtherInfo = (titleObj) => (
    <table className="other-info">
      <thead>
        <tr>
          {Object.keys(titleObj).map((t) => (
            <th>{t}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.keys(titleObj).map((t) => (
            <td>{titleObj[t]}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  // const WithdrawInfo = (item) => (
  //   <Row className="expandable-more-info width-hundred-percent" gutter={[0, 4]}>
  //     <Col span={3} offset={1}>
  //       BILL ID
  //     </Col>
  //     <Col span={8}>{item.admindisposalwithdraw_obj?.bill_id}</Col>
  //     <Col span={3} offset={1}>
  //       CURRENCY
  //     </Col>
  //     <Col span={8}>{item.admindisposalwithdraw_obj?.currency}</Col>

  //     <Col span={3} offset={1}>
  //       IS MASS
  //     </Col>
  //     <Col span={8}>
  //       {item.admindisposalwithdraw_obj?.is_mass === 1 ? "Yes" : "No"}
  //     </Col>
  //     <Col span={3} offset={1}>
  //       IS IMMEDIATE
  //     </Col>
  //     <Col span={8}>
  //       {item.admindisposalwithdraw_obj?.is_immediate === 1 ? "Yes" : "No"}
  //     </Col>

  //     <Col span={3} offset={1}>
  //       RECEIVED MONEY
  //     </Col>
  //     <Col span={8}>
  //       {commonFilter(
  //         "centToUsd",
  //         item.admindisposalwithdraw_obj?.received_money
  //       )}
  //     </Col>
  //     <Col span={3} offset={1}>
  //       ITALKI FEE
  //     </Col>
  //     <Col span={8}>
  //       {commonFilter("centToUsd", item.admindisposalwithdraw_obj?.italki_fee)}
  //     </Col>

  //     <Col span={3} offset={1}>
  //       THIRD FEE
  //     </Col>
  //     <Col span={8}>
  //       {commonFilter("centToUsd", item.admindisposalwithdraw_obj?.third_fee)}
  //     </Col>
  //     <Col span={3} offset={1}>
  //       PAID DATE
  //     </Col>
  //     <Col span={8}>
  //       {commonFilter("fDate", item.admindisposalwithdraw_obj?.paid_date)}
  //     </Col>

  //     <Col span={3} offset={1}>
  //       PAID USER
  //     </Col>
  //     <Col span={8}>{item.admindisposalwithdraw_obj?.paid_user}</Col>
  //     <Col span={3} offset={1}>
  //       REMARK
  //     </Col>
  //     <Col span={8}>{item.admindisposalwithdraw_obj?.remark}</Col>
  //   </Row>
  // );

  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white" id="Hackusermissions">
        {operations}
        {allPage}
        <Detail type="AccountWallet" ref={detailRef} />
        <UploadFile ref={uploadRef} update={() => setFresh(!fresh)} />
        <WriteLog
          title={logType.title}
          onOk={submit}
          onRef={(ref) => setLogModal(ref)}
        />
      </div>
      {selectedRowKeys?.length > 0 && viewRowkeys && (
        <div className="flex-footer">
          {selectStatus === "0" && (
            <>
              <Button
                onClick={() => {
                  setLogType({ title: "batch accept", type: 1 });
                  logModal.onShow();
                }}
                className="flex-btn"
                type="primary"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  setLogType({ title: "batch reject", type: 2 });
                  logModal.onShow();
                }}
                className="flex-btn"
                type="primary"
              >
                Reject
              </Button>
            </>
          )}
          {selectStatus === "1" && (
            <Button
              onClick={() => cashPaidRef.current.open()}
              className="flex-btn"
              type="primary"
            >
              Cash Paid
            </Button>
          )}
        </div>
      )}
      <WithdrawDetail userId={curItem.user_id} ref={WithdrawDetailRef} />
      <CompleteWithdrawal
        curItem={curItem}
        update={() => setFresh(!fresh)}
        ref={completeWithdrawalRef}
      />
      <Withdrawal type='withdrawal' fresh={() => setFresh(!fresh)} ref={withdrawalRef} />
      <BatchApprove update={() => setFresh(!fresh)} ref={batchApproveRef} />
      <CSVDownload
        downloadName="affiliate_withdraw_list"
        visible={downVisible}
        title="Download withdrawal list"
        closeModalFunc={() => {
          setDownVisible(false);
        }}
        all={false}
        defaultCheckbox={AdownloadData}
        defaultChecked={["ORDER ID", "AFFILIATE ID", "AMOUNT", "ACCOUNT($)"]}
        selectObj={{
          ...downloadParams,
          fetch_name: "withdraw_list_csv",
        }}
        downloadUrl={`/withdraw/affiliate-withdrawals`}
      />
    </Spin>
  );
};
export default Affiliate;

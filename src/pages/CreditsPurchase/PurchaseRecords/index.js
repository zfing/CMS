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
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { vtPaymentConfig } from "../../../components/CommonComponent/CommonFunction";
import {
  DeviceType,
  OrderTag,
  SourceType,
  RecordStatus,
  PurchaseRecordsListOperations,
} from "../CredistsConst";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import Filter from "../../../components/Filter";
import {
  get_list_log_submit,
  edit_purchase_or_expandable_list,
} from "./service";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";
import AddNewPurchase from "./modal/AddNewPurchase";
import Refund from "./modal/Refund";
import "../creditsPurchase.css";

const PurchaseRecords = (props) => {
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
  const userId = useRef(null);
  const other = useRef(null);
  // const [queryData, setQueryData] = useState({});
  const [curItem, setCurItem] = useState({});
  const [fresh, setFresh] = useState(false);
  const [rowKeys, setRowKeys] = useState([]);
  const detailRef = useRef(null);
  const [logModal, setLogModal] = useState(false);
  const newPurchaseRef = useRef(null);
  const refundRef = useRef(null);

  useEffect(() => {
    fetch();
  }, [fresh]);
  const fetch = (searchParams, componentAttribute) => {
    setRowKeys([]);
    setLoading(true);
    let params = {
      ...searchParams,
      [userId.current.data.key]: userId.current.data.value,
      ...other?.current?.getValue(),
    };
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
  const ExpandedColumns = [
    {
      title: "CREATE TIME",
      columnTitle: "white",
      className: "expanded-columns-title-bgcolor",
      render: (item) => commonFilter("fDate", item.create_time),
    },
    {
      title: "ACCOUNT",
      columnTitle: "white",
      className: "expanded-columns-title-bgcolor",
      render: (item) =>
        item.effect_userid === item.user_id ? "USER" : "ITALKI",
    },
    {
      title: "TRANSACTION",
      columnTitle: "white",
      className: "expanded-columns-title-bgcolor",
      render: (item) => commonFilter("transactionShowtype", item.show_type),
    },
    {
      title: "AMOUNT",
      columnTitle: "white",
      className: "expanded-columns-title-bgcolor",
      render: (item) =>
        commonFilter("centToUsd", item.trans_amount * item.inout),
    },
  ];
  const columns = [
    {
      title: <span style={{ fontSize: 13 }}>DATE(UTC)</span>,
      width: "15%",
      columnTitle: "white",
      render: (item) => commonFilter("fDate", item.create_time),
    },
    {
      title: <span style={{ fontSize: 13 }}>ORDER ID</span>,
      columnTitle: "white",
      width: "10%",
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
            detailRef?.current?.open(item.user_id);
          }}
        >
          {item.user_id}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>FROM COUNTRY</span>,
      columnTitle: "white",
      width: "15%",
      // render: (item) => item.origin_country_id,
      render: (item) => commonFilter("gt", item.origin_country_id),
    },
    {
      title: <span style={{ fontSize: 13 }}>PAYMENT METHOD</span>,
      columnTitle: "white",
      width: "20%",
      render: (item) => commonFilter("payType", item.pay_type),
    },
    {
      title: <span style={{ fontSize: 13 }}>STATUS</span>,
      columnTitle: "white",
      width: "10%",
      render: (item) => (
        <span>
          {commonFilter("purchaseStatus", item.status)}
          <br />
          {item.status === 6 && (
            <span>
              (
              {item.status === 6 &&
                commonFilter("orderTag", item.adjust_status)}
              )
            </span>
          )}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>CREDITS (USD)</span>,
      width: "10%",
      render: (item) => commonFilter("centToUsd", item.amount),
    },
    {
      // width: "10%",
      render: (item) => {
        const menu = () => (
          <Menu
            className="dropdown-button"
            style={{ width: "100%" }}
            onClick={(obj) => Actions(obj, item)}
          >
            {PurchaseRecordsListOperations.map((list) => {
              let currentPer = false;
              switch (list.key) {
                case "1":
                  currentPer = item.status === 0 || item.status === 2;
                  break;
                case "2":
                  currentPer = item.status === 1;
                  break;
                case "3":
                  currentPer = item.status === 2;
                  break;
                case "4":
                  currentPer = item.status === 6 || item.status === 1;
                  break;
                default:
                  return null;
              }
              return (
                currentPer &&
                HasPermi(list.per) && (
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
          [0, 1, 2, 6].includes(item.status) && (
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
        newPurchaseRef.current.open("edit");
        break;
      case "2":
        refundRef.current.open("refund", item);
        break;
      case "3":
        logModal.onShow();
        break;
      case "4":
        refundRef.current.open("edit", item);
        break;
      default:
        return null;
    }
  };
  const allSearch = [
    {
      title: "Status",
      type: "searchBySelect",
      postParam: "status",
      optionsArr: RecordStatus,
    },
    {
      title: "Payment Method",
      type: "searchBySelect",
      postParam: "pay_type",
      optionsArr: vtPaymentConfig(
        JSON.parse(localStorage.getItem("paymentConfig"))
      ),
    },
    {
      title: "Purchase ITC",
      type: "searchByRange",
      toCent: true,
      maxPostParam: "max_itc",
      minPostParam: "min_itc",
    },
    {
      title: "Order Tag",
      type: "searchBySelect",
      postParam: "adjust_status",
      optionsArr: OrderTag,
    },
    {
      title: "Device Type",
      type: "searchBySelect",
      postParam: "device_type",
      optionsArr: DeviceType,
    },
    {
      title: "Source Type",
      type: "searchBySelect",
      postParam: "source_type",
      optionsArr: SourceType,
    },
    {
      title: "Voucher ID",
      type: "searchByInput",
      postParam: "voucher_id",
    },
    {
      title: "Voucher Use",
      type: "searchBySelect",
      postParam: "voucher_flag",
      optionsArr: [
        { v: "1", t: "Used Voucher" },
        { v: "2", t: "Unused Voucher" },
      ],
    },
    {
      title: "Purchase Date",
      type: "searchByDatepicker",
      minPostParam: "min_ft",
      maxPostParam: "max_ft",
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
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setLoading(true);
    fetch({
      [userId.current.data.key]: userId.current.data.value,
      ...other.current.getValue(),
    });
  };
  const submit = (log_note) => {
    let postData = {
      log_note,
      operate: "cancel",
      user_id: curItem.user_id,
    };

    edit_purchase_or_expandable_list(postData, "post", curItem.order_id)
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
      {HasPermi(1001101) && (
        <Button
          className="blue margin-right-10"
          onClick={() => {
            newPurchaseRef.current.open("add");
          }}
        >
          Create New Purchase
        </Button>
      )}
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
          if (expanded && !record.expanded) { // 是否展开过
            edit_purchase_or_expandable_list(null, null, record.order_id).then(
              (res) => {
                const {
                  data: { data: detailData }
                } = res;
                setData(() =>
                  data.map((item) =>
                    item.id === detailData.id
                      ? { ...item, ...detailData, expanded: true, arrow: false}
                      : item
                  )
                );
              }
            );
          }
        }}
        expandable={{
          expandedRowRender: (item) => {
            return (
                <>
                  <Row className="expandable-more-info" gutter={[0, 4]}>
                    <Col span={3} offset={1}>
                      DEVICE TYPE
                    </Col>
                    <Col span={8}>{Filter("deviceType", item.device_type)}</Col>
                    <Col span={3} offset={1}>
                      SOURCE TYPE
                    </Col>
                    <Col span={8}>
                      {commonFilter("sourceType", item.source_type)}
                    </Col>
                    <Col span={3} offset={1}>
                      CHANNEL TYPE
                    </Col>
                    <Col span={8}>
                      {Filter("channelType", item.channel_type)}
                    </Col>
                    <Col span={3} offset={1}>
                      EVENT STATUS
                    </Col>
                    <Col span={8}>
                      {item.event_status ? "Finished" : "Unfinished"}
                    </Col>
                    <Col span={3} offset={1}>
                      ACTUAL AMOUNT
                    </Col>
                    <Col span={8}>
                      {commonFilter("centToUsd", item.real_used_amount)}{" "}
                      {item.used_currency}
                    </Col>
                    <Col span={3} offset={1}>
                      TAG
                    </Col>
                    <Col span={8}>
                      {commonFilter("orderTag", item.adjust_status)}
                    </Col>
                    <Col span={3} offset={1}>
                      CURRENCY RATE
                    </Col>
                    <Col span={8}>
                      1 U.S. dollar = {item.currency_rate} {item.used_currency}
                    </Col>
                    {item.voucher_amount && (
                      <>
                        <Col span={3} offset={1}>
                          VOUCHER
                        </Col>
                        <Col span={8}>
                          ID : {item.voucher_id} , AMOUNT :{" "}
                          {commonFilter("centToUsd", item.voucher_amount)} USD
                        </Col>
                      </>
                    )}
                  </Row>
                  {item?.transaction_obj_s &&
                    item?.transaction_obj_s.length > 1 && (
                      <Table
                        pagination={false}
                        columns={ExpandedColumns}
                        dataSource={item?.transaction_obj_s}
                      />
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
                        {item?.orderhis_obj_s.map((item) => (
                          <Timeline.Item
                            key={item.status}
                            color={
                              {
                                0: "orange",
                                1: "green",
                                2: "orange",
                                3: "red",
                                4: "orange",
                                5: "red",
                                6: "red",
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
                                1: "green",
                                2: "orange",
                                3: "red",
                                4: "orange",
                                5: "red",
                                6: "red",
                              }[item.status],
                            }}
                          >
                            <div>
                              Status:
                              <span>
                                {commonFilter("purchaseStatus", item?.status)} |
                                Admin：{item.admin_name}{" "}
                                {item.return_order_id && (
                                  <span>
                                    {" "}
                                    | Third Order ID：{item.return_order_id}
                                  </span>
                                )}
                              </span>
                            </div>
                            {item.return_value && (
                              <span>Third Return：{item.return_value}</span>
                            )}
                            {item.comments && <span>{item.comments}</span>}
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      <div style={{ color: "#fb6e52", margin: 10 }}>
                        Currently, This transaction status is{" "}
                        {item.orderhis_obj_s instanceof Array && (
                          <span>
                            {`${commonFilter(
                              "purchaseStatus",
                              item?.orderhis_obj_s[0]?.status
                            )} in ${commonFilter(
                              "fDate",
                              item?.orderhis_obj_s[0]?.update_time
                            )}`}
                          </span>
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
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white" id="Hackusermissions">
        {operations}
        {allPage}
        <Detail type="AccountWallet" ref={detailRef} />
        <AddNewPurchase
          curItem={curItem}
          update={() => setFresh(!fresh)}
          ref={newPurchaseRef}
        />
        <Refund
          curItem={curItem}
          update={() => setFresh(!fresh)}
          ref={refundRef}
        />
        <WriteLog
          title="Cancel Pending Order"
          onOk={submit}
          onRef={(ref) => setLogModal(ref)}
        />
      </div>
    </Spin>
  );
};
export default PurchaseRecords;

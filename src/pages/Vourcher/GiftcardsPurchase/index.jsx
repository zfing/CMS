import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Table, message, Spin, Row, Timeline } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import InputWithSelect from "../../../components/CommonComponent/InputWithSelect.tsx";
import api from "../../../components/Api";
import moment from "moment";
import qs from "qs";
import Detail from "./modal/Detail";

const PaidDetail = {
  0: "Unpaid, New request",
  1: "Paid, Unused",
  2: "Unpaid, Generate order",
  3: "Paid, Expired",
  5: "Used by not receiver",
  6: "Used by receiver",
  9: "Paid, Refund",
};
const SendType = {
  1: "Send email immediately",
  2: "Send email regularly",
  3: "Print",
  4: "The timed email has been sent",
};
const GiftcardsPurchase = (props) => {
  let { orderid } = qs.parse(props.location.search.substr(1));
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
  const detailRef = useRef(null);
  const [rowKeys, setRowKeys] = useState([]);
  const [current, setCurrent] = useState({});
  useEffect(() => {
    getData({ order_id: orderid });
  }, [orderid]);
  async function getData(params) {
    try {
      let {
        data: { meta, data },
      } = await api({
        url: "/voucher/purchase-giftcards",
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
      title: <span style={{ fontSize: 13 }}>CREATE TIME</span>,
      columnTitle: "white",
      render: (item) =>
        item.create_time &&
        moment(item.create_time).utc().format("YYYY-MM-DD HH:mm"),
    },
    {
      title: <span style={{ fontSize: 13 }}>ORDER ID</span>,
      columnTitle: "white",
      dataIndex: "order_id",
    },
    {
      title: <span style={{ fontSize: 13 }}>SENDER</span>,
      columnTitle: "white",
      render: (item) => (
        <span
          className="blue link-hover-underline"
          onClick={(e) => {
            e.stopPropagation();
            detailRef.current.open(item.user_id)
          }}
        >
          {item.user_id}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: 13 }}>STATUS</span>,
      columnTitle: "white",
      render: (item) =>
        ({
          0: "Unpaid, New request",
          1: "Paid, Unused",
          2: "Unpaid, Generate order",
          3: "Paid, Expired",
          5: "Paid, Used by not receiver",
          6: "Paid, Used by receiver",
          9: "Paid, Refund",
        }[item.status] || "Paid"),
    },
    {
      title: <span style={{ fontSize: 13 }}>VALUE (USD)</span>,
      columnTitle: "white",
      render: (item) => item.gift_itc && (item.gift_itc / 100).toFixed(2),
    },
  ];
  const allSearch = [
    {
      title: "Purchase user",
      type: "searchByInput",
      postParam: "buyer",
      placeholder: "ID/Email",
    },
    {
      title: "Purchase email",
      type: "searchByInput",
      postParam: "buyer_email",
      placeholder: "Email",
    },
    {
      title: "Used user",
      type: "searchByInput",
      postParam: "use_user",
      placeholder: "ID/Email",
    },
    {
      title: "Used object",
      type: "searchByInput",
      postParam: "use_object",
      placeholder: "eg: VC8756766295",
    },
    {
      title: "Status",
      type: "searchBySelectMode",
      postParam: "status",
      defaultValue: "",
      optionsArr: [
        {
          t: "Paid",
          v: "",
        },
        {
          t: "Unpaid, New request",
          v: "0",
        },
        {
          t: "Unpaid, Generate order",
          v: "2",
        },
        {
          t: "Paid, Unused",
          v: "1",
        },
        {
          t: "Paid, Used by not receiver",
          v: "5",
        },
        {
          t: "Paid, Used by receiver",
          v: "6",
        },
        {
          t: "Paid, Expired",
          v: "3",
        },
        {
          t: "Paid, Refund",
          v: "9",
        },
      ],
    },
    {
      title: "Time Type",
      type: "searchByDatepickerWithSelect",
      defaultOption: 0,
      postParam: ["min_at", "max_at", "start_time", "end_time"],
      optionsArr: [
        {
          t: "Create Time",
          v: 0,
        },
        {
          t: "Validity Period",
          v: 1,
        },
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
        defaultValue="order_id"
        options={[
          {
            label: "Giftcard Order ID",
            value: "order_id",
            placeholder: "Search by Order ID",
          },
          {
            label: "Giftcard Code",
            value: "voucher_code",
            placeholder: "Search by Code",
          },
        ]}
        inputValue={qs.parse(props.location.search.substr(1)).orderid || ""}
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
        style={{ marginRight: "20px" }}
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
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        expandRowByClick
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        onExpand={async (expanded, record) => {
          const { id } = record;
          if (expanded) {
            let {
              data: { data },
            } = await api({
              url: `/voucher/giftcard/${id}`,
              method: "get",
            });
            setCurrent(data.reverse());
            record.show = false;
            record.history = data;
            setData((data) =>
              data.map((item) => (item.id === id ? record : item))
            );
          }
        }}
        expandable={{
          expandedRowRender: (item) => {
            return (
              <Row gutter={[24, 4]}>
                <Col span={3} offset={1}>
                  SENDER INFO
                </Col>
                <Col span={8}>
                  {item.user_name} / {item.user_email}
                </Col>
                <Col span={3} offset={1}>
                  RECEIVER INFO
                </Col>
                <Col span={8}>
                  {item.recipient_user_id} / {item.recipient_name} /{" "}
                  {item.recipient_email}
                </Col>
                <Col span={3} offset={1}>
                  VALIDITY PERIOD(UTC)
                </Col>
                <Col span={8}>
                  {moment(item.voucher_obj?.start_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")}{" "}
                  to{" "}
                  {moment(item?.voucher_obj?.end_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")}
                </Col>
                <Col span={3} offset={1}>
                  CODE
                </Col>
                <Col span={8}>{item?.voucher_obj?.voucher_code}</Col>
                <Col span={3} offset={1}>
                  SEND TYPE
                </Col>
                <Col span={8}>{SendType[item.send_type]}</Col>
                <Col span={3} offset={1}>
                  MESSAGE
                </Col>
                <Col span={8}>{item.message}</Col>
                {([5, 6].indexOf(item.status) > -1 || item.send_mail_date) && (
                  <>
                    {item.send_mail_date && (
                      <Col span={3} offset={1}>
                        SEND MAIL DATE
                      </Col>
                    )}
                    {item.send_mail_date && (
                      <Col span={8}>{item.send_mail_date}</Col>
                    )}
                    {[5, 6].indexOf(item.status) > -1 && (
                      <Col span={3} offset={1}>
                        USED INFO
                      </Col>
                    )}
                    {[5, 6].indexOf(item.status) > -1 && (
                      <Col span={8}>
                        UserID - {item?.voucher_obj?.user_id} / Time -{" "}
                        {moment(item?.voucher_obj?.use_date)
                          .utc()
                          .format("YYYY-MM-DD HH:mm")}
                        / Object -{item?.voucher_obj?.use_object}
                      </Col>
                    )}
                  </>
                )}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    backgroundColor: "#d3d3d3",
                    margin: "0 60px",
                    paddingLeft: 10,
                  }}
                >
                  <Col
                    span={23}
                    onClick={() => {
                      const { show, id } = item;
                      setData((data) =>
                        data.map((item) =>
                          item.id === id ? { ...item, show: !show } : item
                        )
                      );
                    }}
                  >
                    <h4>STATUS TIMELINE</h4>
                  </Col>
                  <Button
                    type="text"
                    icon={item.show ? <UpOutlined /> : <DownOutlined />}
                  ></Button>
                </div>
                {item.show ? (
                  <Timeline mode="left" style={{ marginTop: 20 }}>
                    {item.history &&
                      current?.map((item) => (
                        <Timeline.Item
                          key={item.status}
                          color={
                            {
                              0: "orange",
                              1: "orange",
                              2: "orange",
                              3: "red",
                              5: "orange",
                              6: "green",
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
                              2: "orange",
                              3: "red",
                              5: "orange",
                              6: "green",
                            }[item.status],
                          }}
                        >
                          <div>
                            Status:
                            <span>
                              ({item.status})&nbsp;
                              {PaidDetail[item.status]}
                            </span>
                            <span>{item.user_message}</span>
                          </div>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                ) : (
                  <div style={{ color: "#fb6e52", marginLeft: 80 }}>
                    item Currently, This transaction status is&nbsp;
                    {item?.history && PaidDetail[item?.history[0]?.status]}
                    &nbsp;in&nbsp;
                    {item?.history &&
                      moment(item?.history[0]?.update_time)
                        .utc()
                        .format("YYYY-MM-DD HH:mm")}
                  </div>
                )}
              </Row>
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
      <div className="default-font content-box bg-white">
        {operations}
        {allPage}
        <Detail ref={detailRef} type='all' />
      </div>
    </Spin>
  );
};

export default GiftcardsPurchase;

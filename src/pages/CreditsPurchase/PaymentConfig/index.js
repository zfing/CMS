import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Table,
  notification,
  Spin,
  Row,
  Input,
  Tag,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined
} from "@ant-design/icons";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { vtPaymentSuppliers } from "../../../components/CommonComponent/CommonFunction";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import { get_list_log_submit } from "./service";
import PaymentMethed from "./modal/PaymentMethed";
import Detail from "./modal/Detail";
import { UsingStatus } from "../CredistsConst";
import "../creditsPurchase.css";

const PaymentConfig = (props) => {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [moreFilter, setMoreFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({ data: [], meta: { total: 0 } });
  const payId = useRef(null);
  const other = useRef(null);
  const [curItem, setCurItem] = useState({});
  const [fresh, setFresh] = useState(false);
  const [rowKeys, setRowKeys] = useState([]);
  const detailRef = useRef(null);
  const newPaymentRef = useRef(null);

  useEffect(() => {
    fetch();
  }, [fresh]);
  const fetch = (searchParams, componentAttribute) => {
    setRowKeys([]);
    setLoading(true);
    let params = {
      ...other?.current?.getValue(),
      ...searchParams,
      pay_type: payId?.current?.state?.value
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
      title: <span style={{ fontSize: 13 }}>ID</span>,
      width: "10%",
      columnTitle: "white",
      dataIndex: "pay_type",
    },
    {
      // 供应商
      title: <span style={{ fontSize: 13 }}>PROVIDER</span>,
      columnTitle: "white",
      width: "10%",
      render: (item) => commonFilter("payMethodSupplier", item.pay_supplier_id),
    },
    {
      // 网站所用编码
      title: <span style={{ fontSize: 13 }}>CODE</span>,
      columnTitle: "white",
      width: "10%",
      dataIndex: "code",
    },
    {
      title: <span style={{ fontSize: 13 }}>NAME</span>,
      columnTitle: "white",
      width: "15%",
      dataIndex: "name",
    },
    {
      title: <span style={{ fontSize: 13 }}>COMMISSION/BASE FEE(USD)</span>,
      columnTitle: "white",
      width: "15%",
      render: (item) => `${item.commission} / ${item.base_fee}`,
    },
    {
      title: <span style={{ fontSize: 13 }}>CREATE TIME</span>,
      columnTitle: "white",
      width: "15%",
      render: (item) => commonFilter("fDate", item.create_time),
    },
    {
      title: <span style={{ fontSize: 13 }}>USING STATUS</span>,
      width: "15%",
      render: (item) => commonFilter("payMethodStatus", item.status),
    },
    {
      width: "10%",
      render: (item) => (
        <span
          className="blue link-hover-underline"
          onClick={(e) => {
            setCurItem(item);
            e.stopPropagation();
            detailRef.current.open()
          }}
        >
          Detail
        </span>
      ),
    },
  ];

  const allSearch = [
    {
      title: "Provider",
      type: "searchBySelect",
      postParam: "supplier_id",
      optionsArr: vtPaymentSuppliers(JSON.parse(localStorage.getItem("payment_suppliers")), 'vt'),
    },
    {
      title: "Using Status",
      type: "searchBySelect",
      postParam: "status",
      noDefaultOption: true,
      defaultValue: '999',
      optionsArr: UsingStatus
    },
    {
      title: "Country",
      type: "searchBySelect",
      postParam: "country",
      optionsArr: JSON.parse(localStorage.getItem('countryCodeList')),
    }
  ];
  const handleTableChange = (page) => {
    setLoading(true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let { pageSize, current } = page;
    fetch({
      pay_type: payId?.current?.state?.value,
      ...other.current.getValue(),
      page: current,
      page_size: pageSize,
    });
  };
  const btnQuery = () => {
    setLoading(true);
    fetch({
      pay_type: payId?.current?.state?.value,
      ...other.current.getValue(),
    });
  };
  const operations = (
    <div className="bg-white flex-end height-60">
      <Input
        className="width-200 margin-0"
        placeholder="Search by ID"
        ref={payId}
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
      {HasPermi(1001301) && (
        <Button
          className="blue margin-right-10"
          onClick={() => {
            newPaymentRef.current.open("add");
          }}
        >
          Add a New Payment Methed
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
              // setQueryData(value);
              setFresh(!fresh)
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
        rowKey="pay_type"
        expandRowByClick
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{
          ...pagination,
          total: result?.meta?.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items `}</span>
          ),
        }}
        expandedRowRender={(item) => {
          return (
            <Row className="expandable-more-info" gutter={[0, 4]}>
              <Col span={3} offset={1}>
                DEFAULT IMG NAME
              </Col>
              <Col span={8}>{item.img_name}</Col>
              <Col span={3} offset={1}>
                DEFAULT SORT ID
              </Col>
              <Col span={8}>{item.default_sort}</Col>
              <Col span={3} offset={1}>
                COUNTRIES
              </Col>
              {/* <Col span={8}>{item.countries}</Col> */}
              <Col span={8}>
                {!!item.countries &&
                  item.countries
                    .split(",")
                    .map((cur) => (
                      <Tag key={cur} className="margin-bottom-5">
                        {commonFilter("gt", cur)}
                      </Tag>
                    ))}
              </Col>
            </Row>
          );
        }}
        expandedRowKeys={rowKeys}
        onExpandedRowsChange={(e) => {
          setRowKeys(e);
        }}
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white" id="Hackusermissions">
        {operations}
        {allPage}
        <Detail curItem={curItem} ref={detailRef} />
        <PaymentMethed
          curItem={curItem}
          update={() => setFresh(!fresh)}
          ref={newPaymentRef}
          type='add'
        />
      </div>
    </Spin>
  );
};
export default PaymentConfig;

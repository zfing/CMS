import React, { useState, useEffect } from "react";
import { Button, Table, Input, Row, Col, notification, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  commonFilter,
  deleteEmptyObj,
} from "../../../components/CommonComponent/CommonFunction";
import { get_transfers_list } from "./service";
import { WalletBOSTransfer } from "../WalletConst";
import "../wallet.css";

const { Option } = Select;
const BOSHistory = () => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [selectType, setType] = useState({children: "BOS ID", value: "organiz_id"});
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    // defaultPageSize: "10",
    // showSizeChanger: false,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = {
      ...searchParams,
      [selectType?.value]: inputValue
    };
    get_transfers_list(deleteEmptyObj(params))
      .then((result) => {
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
  const btnQuery = () => {
    fetch({ page: pagination.current, page_size: pagination.pageSize });
  };

  const tableColumns = [
    {
      title: <span className="text-bold">CREATE TIME</span>,
      key: "create_time",
      render: (item) => commonFilter("fDate", item.create_time),
    },
    {
      title: <span className="text-bold"> ORDER ID </span>,
      key: "order_id",
      dataIndex: "order_id",
    },
    {
      title: <span className="text-bold">OPERATOR</span>,
      key: "operator_id",
      render: (item) => (item.operator_id ? item.operator_id : item.admin_name),
    },
    {
      title: <span className="text-bold">BOS ID</span>,
      key: "organization_id",
      dataIndex: "organization_id",
    },
    {
      title: <span className="text-bold">From</span>,
      key: "from_wallet_id",
      dataIndex: "from_wallet_id",
    },
    {
      title: <span className="text-bold">To</span>,
      key: "to_wallet_id",
      dataIndex: "to_wallet_id",
    },
    {
      title: <span className="text-bold">TRANS AMOUNT(USD)</span>,
      key: "trans_amount",
      render: (item) => commonFilter("centToUsd", item.trans_amount),
    },
  ];
  const operations = (
    <Row className="color-white search-bar" align="middle">
      <Col
        className="display-flex"
        span={24}
        style={{ justifyContent: "flex-end" }}
      >
        <Select
          style={{ width: "12%" }}
          defaultValue="organiz_id"
          onChange={(v,e) => {
            setType(e)
          }}
        >
          {
            WalletBOSTransfer.map(item => <Option key={item.v} value={item.v}>{item.name}</Option>)
          }
        </Select>
        <Input
          className="width-200 margin-0"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Search by ${selectType?.children}`}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="width-46 margin-right-10"
          onClick={btnQuery}
        />
      </Col>
    </Row>
  );
  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      <Table
        className="margin-top-0 blue Table funding"
        columns={tableColumns}
        dataSource={resultObj.data}
        rowKey="user_id"
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => `Total ${total} items`,
        }}
        loading={loading}
        expandRowByClick
        onChange={handleTableChange}
      />
    </div>
  );
};

export default BOSHistory;

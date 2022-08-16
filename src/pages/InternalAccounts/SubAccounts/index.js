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
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import {
  commonFilter,
  deleteEmptyObj,
} from "../../../components/CommonComponent/CommonFunction";
import Detail from "./modal/Detail";
import { get_wallet_list } from "./service";

const { Option } = Select;
const SubAccount = () => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    defaultPageSize: "10",
    // pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("1");
  const detailRef = useRef(null)

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
      status,
      account_id: inputValue,
    };
    get_wallet_list(deleteEmptyObj(params))
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
      title: <span className="text-bold">ID</span>,
      key: "id",
      width: "10%",
      dataIndex: "id",
    },
    {
      title: <span className="text-bold">ACCOUNT NAME</span>,
      key: "name",
      width: "30%",
      render: (item) => (
        <span>
          {item.name}
          <br />
          {item.comments}
        </span>
      ),
    },
    {
      title: <span className="text-bold">AVAILABLE BALANCE (USD)</span>,
      key: "usd",
      width: "30%",
      render: (item) => (
        <>
          {commonFilter("centToUsd", item.sv)}
          {item.tv !== 0 && (
            <span className="color-red">
              <br />
              {commonFilter("centToUsd", item.tv)}
            </span>
          )}
        </>
      ),
    },
    {
      title: <span className="text-bold">TYPE</span>,
      key: "type",
      width: "10%",
      render: (item) =>
        commonFilter("costCenterCategory", item.costcenter_code),
    },
    {
      title: <span className="text-bold">STATUS</span>,
      key: "status",
      width: "10%",
      render: (item) => (item.status === 1 ? "Active" : "Inactive"),
    },
    {
      width: "10%",
      render: (item) => {
        const menu = () => (
          <Menu
            onClick={() => detailRef.current.open(item)}
          >
            <Menu.Item
              key="2"
              onClick={(e) => {
                e.domEvent.stopPropagation();
              }}
            >
              View Transaction
            </Menu.Item>
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

  const operations = (
    <Row className="color-white search-bar" align="middle">
      <Col
        className="display-flex"
        span={24}
        style={{ justifyContent: "flex-end" }}
      >
        <Select
          style={{ width: "15%" }}
          defaultValue="1"
          onChange={(v) => setStatus(v)}
        >
          <Option value="-1" key="-1">
            STATUS: All
          </Option>
          <Option value="1" key="1">
            STATUS: Active
          </Option>
          <Option value="0" key="0">
            STATUS: Inactive
          </Option>
        </Select>
        <Input
          className="width-200 margin-0"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Account ID"
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
        rowKey="subAccountId"
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => (
            <span className="text-bold-7">{`Total ${total} items, Total USD: ${commonFilter(
              "centToUsd",
              resultObj.meta.sum_itc
            )}`}</span>
          ),
        }}
        loading={loading}
        expandRowByClick
        onChange={handleTableChange}
      />
      <Detail ref={detailRef} />
    </div>
  );
};

export default SubAccount;

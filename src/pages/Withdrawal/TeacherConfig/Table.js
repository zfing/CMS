import React, { useEffect, useState } from "react";
import { Table, notification, Col } from "antd";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { get_List } from "./service";
import "../withdrawal.css";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";

const GBAList = React.forwardRef((props, ref) => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [queryData, setQueryData] = useState({});
 
  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...queryData,
    });
  }, [pagination, queryData]);

  const tableColumns = [
    {
      title: 'TEACHER ID',
      dataIndex: "user_id",
    },
    {
      title: 'ACCOUNT TYPE',
      dataIndex: "account_type",
    },
    {
      title: 'ACCOUNT',
      dataIndex: "account",
    },
    {
      title: 'ACCOUNT COMMENT',
      dataIndex: "account_comment",
    },
    {
      title: 'STATUS',
      render: (item) => item.status === 1 ? 'Active':'Inactive'
    },
    {
      title: 'IS PRIMARY',
      dataIndex: 'is_primary'
    },
    {
      title: 'CREATE TIME',
      render: (item) => commonFilter('fDate', item.create_time)
    },
  ];

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = { ...searchParams };
    get_List(params)
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
  const AllSearch = [
    {
      type: "searchByInput",
      title: "Teacher",
      postParam: 'user',
      placeholder: 'ID / Email'
    },
    {
      type: "searchByInput",
      title: "Account",
      postParam: "account"
    },
    {
      type: "searchByInput",
      title: "Account type",
      postParam: "account_type"
    }
  ]
  return (
    <>
      {props.filterShow && (
        <Col
          className={`${
            props.filterShow === true ? "gutter-example" : "display-none"
          } search-more`}
        >
          <CommonSelects
            search={(value) => {
              setPagination({ ...pagination, current: 1, page: 1 });
              setQueryData(value);
            }}
            allSearch={AllSearch}
          />
        </Col>
      )}
      <Table
        className="margin-top-0 blue Table funding"
        columns={tableColumns}
        dataSource={resultObj.data}
        rowKey="id"
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => `Total ${total} items`,
        }}
        loading={loading}
        expandRowByClick
        onChange={handleTableChange}
      />
    </>
  );
});

export default GBAList;

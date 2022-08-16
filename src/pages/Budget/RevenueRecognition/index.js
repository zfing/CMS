import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Col, notification, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { recognition } from "../../../components/CommonComponent/CommonConst";
import { commonFilter, deleteEmptyObj } from "../../../components/CommonComponent/CommonFunction";
import { get_recognitions_List } from "./service";
import AddRecognition from "./modals/addRecognition";
import "../budget.css";

const RevenueRecognition = () => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const [queryData, setQueryData] = useState({});
  const [moreFilter, setMoreFilter] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [accountId, setAccoundId] = useState('');
  const addRecognition = useRef(null)

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...queryData
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, queryData, fresh]);

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = {account_id: accountId, ...searchParams};
    get_recognitions_List(deleteEmptyObj(params))
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
    fetch(queryData)
  };
  const tableColumns = [
    {
      title: 'DATE / TIME (UTC)',
      key: "create_time",
      width: "20%",
      render: (item) => moment.utc(item.create_time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: 'SUB ACCOUNT',
      key: "category_code",
      width: "40%",
      render: (item) => {
        const currentItem = JSON.parse(localStorage.getItem('subAccounts')).find(sub => item.account_id === sub.id)
        return (`(${currentItem.id}) ${currentItem.name}`)
      }
    },
    {
      title: 'CREDIT (USD)',
      key: "usage_limit",
      width: "15%",
      render: (item) => commonFilter('centToUsd', item.amount) 
    },
    {
      title: 'OPERATOR',
      key: "finish_flag",
      width: "15%",
      render: (item) => item.admin_name
    },
    {
      title: 'REMARKS',
      width: "10%",
      render: (item) => <span className='world-break-break-all'>{item.remark}</span>
    },
  ];
  const operations = (
    <div className="color-white search-bar">
      <div className="float-right display-flex">
        <div className="margin-t-10">
          <Select
            placeholder="Search by Sub-Account"
            style={{ width: 290 }}
            defaultValue={''}
            onChange={(v) => setAccoundId(v)}
          >
            <Select.Option value={''} key="0">
              Search by Sub-Account
            </Select.Option>
            {recognition?.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {`(${item.id}) ${item.name}`}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="width-46"
            onClick={btnQuery}
          />
        </div>
        <Button
          type="default"
          className={`${
            moreFilter === true ? "more-filter-button" : ""
          } blue margin-10-10-0-10`}
          icon={<FilterOutlined />}
          onClick={() => setMoreFilter((moreFilter) => !moreFilter)}
        >
          More Filter
        </Button>
        {HasPermi(1005401) && (
          <Button
            className="blue margin-10-10-0-0"
            onClick={() => addRecognition.current.open()}
          >
            Revenue Recognition
          </Button>
        )}
      </div>
    </div>
  );
  const allPage = (
    <>
    {moreFilter && (
      <Col
        className={`${
          moreFilter === true ? "gutter-example" : "display-none"
        } search-more`}
      >
        <CommonSelects
          search={(value) => {
            setPagination({ ...pagination, current: 1, page: 1});
            setQueryData(value);
          }}
          allSearch={[
            {
              type: "searchByDatepicker",
              title: "Create Time",
              minPostParam: "min_ct",
              maxPostParam: "max_ct",
            }
          ]}
        />
      </Col>
    )}
    </>
  )
  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      {allPage}
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
      <AddRecognition ref={addRecognition} fresh={() => setFresh(!fresh)} />
    </div>
  );
};

export default RevenueRecognition;
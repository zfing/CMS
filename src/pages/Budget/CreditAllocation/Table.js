import React, { useEffect, useState, useImperativeHandle } from "react";
import { Table, notification, Col, Dropdown, Menu,Button, Tooltip, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { get_allocations_List } from "./service";
import "../budget.css";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import { subAccountVT } from "../../../components/CommonComponent/CommonConst";

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
  const [expandArr, setExpandArr] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [logModal, setLogModal] = useState(false);
 
  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...queryData,
    });
  }, [pagination, queryData, props.fresh]);

  useImperativeHandle(ref, () => ({
    search: () => {
      setPagination({ ...pagination, current: 1 });
    },
  }));

  const tableColumns = [
    {
      title: 'DATE / TIME (UTC)',
      key: "create_time",
      width: "20%",
      render: (item) => moment.utc(item.create_time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: 'SUB ACCOUNT',
      key: "account_id",
      width: "30%",
      render: (item) => {
          const currentItem = JSON.parse(localStorage.getItem('subAccounts')).find(sub => item.account_id === sub.id)
          return (`(${currentItem.id}) ${currentItem.name}`)
        }
    },
    {
      title: 'CREDIT (USD)',
      key: "usage_limit",
      width: "20%",
      render: (item) => commonFilter('centToUsd', item.trans_amount * item.inout) 
    },
    {
      title: 'OPERATOR',
      key: "finish_flag",
      width: "20%",
      render: (item) => item.admin_name
    },
    {
      width: "10%",
      render: (item) => {
        const menu = (item) => (
          <Menu className="dropdown-button">
            <Menu.Item
              key="1"
              onClick={(e) => {
                logModal.onShow()
                setCurrentItem(item)
              }}
            >
              Reverse
            </Menu.Item>
          </Menu>
        );
        if(item.inout === 1 && item.undo_id === 0 && HasPermi(1005302)) {
          return (
            <Dropdown
              overlay={menu(item)}
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
                />
              </Tooltip>
            </Dropdown>
          )
        } else if(item.undo_id > 0) {
          return item.inout === 1 ? "Reversed" : ""
        }
      },
    },
  ];

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = { ...searchParams };
    get_allocations_List(params)
      .then((result) => {
        setExpandArr([]);
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

  const submit = (log_note) => {
    const postData = {
      id: currentItem.id,
      operate: 'credit_allocation_undo',
      account_id: currentItem.account_id,
      log_note
    }
    get_allocations_List(postData, 'post')
    .then(res => {
      const {data: {data: success}} = res
      success && message.success('Success')
      logModal.onCancel()
      fetch()
    })
    .catch(err => message.error(err?.error?.msg))
  }
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
            allSearch={[
              {
                type: "searchBySelect",
                title: "Sub Account",
                postParam: 'account_id',
                optionsArr: subAccountVT.length > 0 && subAccountVT
              },
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
        expandedRowKeys={expandArr}
        onChange={handleTableChange}
      />
      <WriteLog 
        title='Reverse'
        onRef={(ref) => setLogModal(ref)}
        onOk={submit}
      />
    </>
  );
});

export default GBAList;

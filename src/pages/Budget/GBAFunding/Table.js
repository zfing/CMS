import React, { useEffect, useState, useImperativeHandle } from "react";
import { Table, notification, Col, Dropdown, Menu,Button, Tooltip, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import CommonSelects from "../../../components/CommonComponent/CommonSelects";
import { get_funding_List, gba_funding_undo } from "./service";
import { commonFilter } from "../../../components/CommonComponent/CommonFunction";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import "../budget.css";

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
      width: "30%",
      render: (item) => moment.utc(item.create_time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: 'OPERATION',
      key: "category_code",
      width: "20%",
      render: (item) => item.inout === 1 ? "Funding" : "Reversal"
    },
    {
      title: 'CREDIT (USD)',
      key: "usage_limit",
      width: "30%",
      render: (item) => commonFilter('centToUsd', item.trans_amount * item.inout) 
    },
    {
      title: 'OPERATOR',
      key: "finish_flag",
      width: "10%",
      render: (item) => item.admin_name
    },
    {
      width: "10%",
      render: (item) => {
        const menu = (item) => (
          <Menu className="dropdown-button" style={{ width: 120 }}>
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
        if(item.inout === 1 && item.undo_id === 0 && HasPermi(1005202)) {
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
    get_funding_List(params)
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
      operate: 'gba_funding_undo',
      log_note
    }
    gba_funding_undo(postData)
    .then(res => {
      const {data: {data: success}} = res
      success && message.success('Success')
      logModal.onCancel()
      fetch()
    })
    .catch(err => message.err(err?.error?.msg))
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
              props.update();
              setPagination({ ...pagination, current: 1, page: 1 });
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

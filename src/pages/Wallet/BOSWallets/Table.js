import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Table, notification, Dropdown, Tooltip, Button, Menu, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { commonFilter, deleteEmptyObj } from "../../../components/CommonComponent/CommonFunction";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import { get_list } from "./service";
import { BOSWalletListOperations } from "../WalletConst";
import TableDetail from "../../Vourcher/GiftcardsPurchase/modal/TableDetail";
import BOSCredit from "./modals/BOSCredit.tsx";
import GetGiveCredit from "./modals/GetGiveCredit.tsx";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import "../wallet.css";
import { get_members_list } from "./service";

const CreditHistoryList = React.forwardRef((props, ref) => {
  const [resultObj, setResultObj] = useState({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [curItem, setCurItem] = useState({});
  const [postData, setPostData] = useState({});
  const [modal, setModal] = useState(null);
  const [logType, setLogType] = useState({title: '', key: null, type: null});
  const [transModalVisible, setTransModalVisible] = useState(false);
  const [getGiveVisible, setGetGiveVisible] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  const tableDetail = useRef(null);
  // const bosCreditRef = useRef(null);

  useImperativeHandle(ref, () => ({
    search: () => {
      setPagination({ ...pagination, current: 1 });
    },
  }));

  const Actions = (obj, item) => {
    setCurItem(item);
    const { key } = obj;
    switch (key) {
      case "1":
        tableDetail.current.openModal(1, "Recharge Detail");
        break;
      case "2":
        tableDetail.current.openModal(
          2,
          `S Wallet : ${item?.id} Transaction Detail`
        );
        break;
      case "3":
        setTransModalVisible(true);
        setLogType({title: "Credits Transfer", key})
        break;
      case "4":
        setGetGiveVisible(true)
        setLogType({title: "Get Credits from BOS - ", key, type: 'get'})
        break;
      case "5":
        setGetGiveVisible(true)
        setLogType({title: "Give Credits to BOS - ", key, type: 'give'})
        break;
      default:
        return null;
    }
  };
  const tableColumns = [
    {
      title: "BOS ID",
      key: "id",
      width: "15%",
      dataIndex: "id",
    },
    {
      title: "DISPLAY NAME",
      key: "displayName",
      width: "35%",
      dataIndex: "display_name",
    },
    {
      title: "COUNTRY",
      key: "country",
      width: "20%",
      render: (item) => commonFilter("gt", item.country),
    },
    {
      title: "MEMBERS",
      key: "members",
      width: "10%",
      dataIndex: "members",
    },
    {
      title: "UNALLOCATED BALANCE(USD)",
      key: "sv",
      width: "10%",
      render: (item) => commonFilter("centToUsd", item.sv),
    },
    {
      title: "ACTIONS",
      width: "10%",
      key: "actions",
      render: (item) => {
        const menu = () => (
          <Menu
            className="dropdown-button"
            style={{ width: "100%" }}
            onClick={(obj) => Actions(obj, item)}
          >
            {BOSWalletListOperations.map((list) => {
              if (list.key === "3") {
                return (
                  item.members > 0 &&
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
              } else if (list.key === "4") {
                return (
                  item.sv > 0 &&
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
              } else {
                return (
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
              }
            })}
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

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = { ...searchParams };
    get_list(params)
      .then((result) => {
        setResultObj({ data: result.data.data, meta: result.data.meta });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Cannot get data",
        });
      })
      .finally((_) => setLoading(false));
  };

  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
      ...props.params,
    });
  }, [pagination, props.params, fresh]);
  const dealTask = async (log_note) => {
    let data = deleteEmptyObj({...postData, log_note})
    switch (logType?.key) {
      case "3":
        Reflect.set(data, 'operate', 'transfer_itc')
        break;
      case "4":
        Reflect.set(data, 'operate', 'bos_charge_fee')
        break;
      case "5":
        Reflect.set(data, 'operate', 'give_credits_to_bos');
        break;
      default:
        return null;
    }
    try {
      const res = await get_members_list(data,'post',curItem?.id);
      if (res?.data?.data?.success) {
        notification.success({
          message: "Success",
        });
        setTransModalVisible(false);
        setGetGiveVisible(false)
        setFresh(!fresh)
      } 
      modal.onCancel();
    } catch (err) {
      message.error(err?.error?.msg);
    }
  };
  return (
    <>
      <Table
        className="margin-top-0 blue Table"
        columns={tableColumns}
        dataSource={resultObj.data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          total: resultObj.meta.total,
          showTotal: (total) => (
            <span className="font-size-15 text-bold">{`Total:${total} items`}</span>
          ),
        }}
        expandRowByClick
        onChange={handleTableChange}
      ></Table>
      <TableDetail userId={curItem?.id} ref={tableDetail} />
      <BOSCredit
        curItem={curItem}
        // ref={bosCreditRef}
        visible={transModalVisible}
        onCancel={() => setTransModalVisible(false)}
        onMessage={(data) => {
          setPostData(data);
          modal.onShow();
        }}
      />
      <GetGiveCredit
        curItem={curItem}
        visible={getGiveVisible}
        title={logType?.title}
        type={logType?.type}
        onCancel={() => setGetGiveVisible(false)}
        onMessage={(data) => {
          setPostData(data);
          modal.onShow();
        }}
      />
      <WriteLog
        title={['4', '5'].includes(logType?.key) ? logType?.title + curItem?.id : logType?.title}
        onRef={(ref) => setModal(ref)}
        onOk={(log) => {
          dealTask(log);
        }}
      />
    </>
  );
});

export default CreditHistoryList;

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
  message,
  Modal,
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import FrozenUserWallet from "./modals/FrozenUserWallet";
import {
  commonFilter,
  deleteEmptyObj,
} from "../../../components/CommonComponent/CommonFunction";
import { get_wallet_list, log_submit } from "./service";
import { WalletDesc, UserWalletOperations } from "../WalletConst";
import "../wallet.css";
import WriteLog from "../../../components/CommonComponent/WriteLog";
import CreditsFromToST from "./modals/CreditsFromToST";
import Detail from "../../Vourcher/GiftcardsPurchase/modal/Detail";

const { Option } = Select;
const UserWallet = () => {
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
  const [fresh, setFresh] = useState(false);
  const [is_freeze, setIs_freeze] = useState("-1");
  const [desc, setDesc] = useState("user_id");
  const [logModal, setLogModal] = useState(false);
  const [logKey, setLogKey] = useState("-1");
  const [frozenUser, setFrozenUser] = useState(null);
  const [logValues, setLogValues] = useState({
    id: null,
    operate: "",
    title: "",
  });
  const [tempData, setTempData] = useState({ data: {}, user: "" });
  const [allRes, setAllRes] = useState([]);
  const [errVisible, setErrVisible] = useState(false);
  const commonLogRef = useRef(null);
  const creditsModal = useRef(null);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch({
      page: pagination.current,
      page_size: pagination.pageSize,
      total: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, fresh, desc]);

  const fetch = (searchParams, componentAttribute) => {
    setLoading(true);
    let params = {
      ...searchParams,
      is_freeze,
      user: inputValue,
      sort_column: desc,
      fetch_name: "user_wallet",
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
  const frozenST = (id, operate, title) => {
    setLogValues({ id, operate, title });
    setLogKey("-1");
    logModal.onShow();
  };
  const confirm = (log_note) => {
    let postData = { log_note };
    switch (logKey) {
      case "1":
        Reflect.set(postData, "operate", "frozen_sv");
        break;
      case "2":
        Reflect.set(postData, "operate", "confiscate_student_credits");
        break;
      case "3":
        Reflect.set(postData, "operate", "confiscate_teacher_credits");
        break;
      case "4":
        Reflect.set(postData, "operate", "give_credits_to_student");
        break;
      case "5":
        Reflect.set(postData, "operate", "give_credits_to_teacher");
        break;
      case "-1":
        // 表格每一项的操作
        Reflect.set(postData, "operate", logValues.operate);
        log_submit(postData, "post", logValues.id)
          .then((res) => {
            const {
              data: { data: success },
            } = res;
            success && message.success("Success");
            logModal.onCancel();
            setFresh(!fresh);
          })
          .catch((err) => message.error(err?.error?.msg));
        return false
      default:
        return null;
    }
    let pros = [];
    if (logKey) {
      if (logKey === "1") {
        pros.push(log_submit(postData, "post", frozenUser));
      } else {
        pros = [
          ...tempData?.user?.map((item) =>
            log_submit({ ...postData, ...tempData.data }, "post", item)
          ),
        ];
      }
    }
    const allPromises = Promise.allSettled(pros);
    allPromises.then((res) => {
      if (logKey === "1") {
        const { status, reason } = res[0];
        if (status === "fulfilled") {
          message.success("Success");
          logModal.onCancel();
          commonLogRef.current.cancel();
          setFresh(!fresh);
        } else {
          message.error(reason.error.msg);
        }
      } else {
        res.map(
          (item) =>
            item.status === "rejected" && message.error(item.reason.error.msg)
        );
        setErrVisible(true);
        logModal.onCancel();
        setAllRes(res);
      }
    });
  };
  const tableColumns = [
    {
      title: <span className="text-bold">USER ID</span>,
      key: "user_id",
      width: "20%",
      render: (item) => (
        <span className="link-hover-underline cursor-pointer blue" onClick={(e) => {
          e.stopPropagation();
          detailRef.current.open(item.user_id)
        }}>
          {item.user_id}
        </span>
      ),
    },
    {
      title: <span className="text-bold">余额(不包含钱包冻结金额) (USD)</span>,
      key: "stav",
      width: "40%",
      render: (item) => (
        <span>
          S: {commonFilter("centToUsd", item.sv)}
          <br />
          T: {commonFilter("centToUsd", item.tv)}
          <br />
          A: {commonFilter("centToUsd", item.av)}
        </span>
      ),
    },
    {
      title: <span className="text-bold">STATUS</span>,
      key: "stFrozen",
      width: "10%",
      render: (item) => (
        <span>
          S: {[0, 2].indexOf(item.status) > -1 ? "Active" : "Frozen"}
          <br />
          T: {[1, 0].indexOf(item.status) > -1 ? "Active" : "Frozen"}
        </span>
      ),
    },
    {
      title: <span className="text-bold">EVER BEEN FROZEN</span>,
      key: "is_freeze",
      width: "20%",
      render: (item) => (item.is_freeze ? "YES" : "NO"),
    },
    {
      width: "10%",
      render: (item) => {
        const menu = () => (
          <Menu className="">
            {HasPermi(1002101) && (
              <Menu.Item
                key="1"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                {[0, 2].indexOf(item.status) > -1 && (
                  <span
                    onClick={() =>
                      frozenST(
                        item.user_id,
                        "frozen_sv",
                        "Frozen Student Wallet"
                      )
                    }
                  >
                    Frozen Student Wallet
                  </span>
                )}
                {[1, 3].indexOf(item.status) > -1 && (
                  <span
                    onClick={() =>
                      frozenST(
                        item.user_id,
                        "unfrozen_sv",
                        "Unfrozen Student Wallet"
                      )
                    }
                  >
                    Unfrozen Student Wallet
                  </span>
                )}
              </Menu.Item>
            )}
            {HasPermi(1002102) && (
              <Menu.Item
                key="2"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                }}
              >
                {[0, 1].indexOf(item.status) > -1 && (
                  <span
                    onClick={() =>
                      frozenST(
                        item.user_id,
                        "frozen_tv",
                        "Frozen Teacher Wallet"
                      )
                    }
                  >
                    Frozen Teacher Wallet
                  </span>
                )}
                {[2, 3].indexOf(item.status) > -1 && (
                  <span
                    onClick={() =>
                      frozenST(
                        item.user_id,
                        "unfrozen_tv",
                        "Unfrozen Teacher Wallet"
                      )
                    }
                  >
                    Unfrozen Teacher Wallet
                  </span>
                )}
              </Menu.Item>
            )}
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
  const confiscateCredits = (item) => {
    const { key, domEvent } = item;
    setLogValues({ title: domEvent.target.innerText });
    setLogKey(key);
    switch (key) {
      case "1":
        commonLogRef.current.openLog();
        break;
      case "2":
        creditsModal.current.open(
          "Select a reason for confiscated student's credits",
          key
        );
        break;
      case "3":
        creditsModal.current.open(
          "Select a reason for confiscated teacher's credits",
          key
        );
        break;
      case "4":
        creditsModal.current.open(
          "Select a reason for credits to the student",
          key
        );
        break;
      case "5":
        creditsModal.current.open(
          "Select a reason for credits to the teacher",
          key
        );
        break;
      default:
        return null;
    }
  };
  const submitFrozen = (v) => {
    setFrozenUser(v);
    logModal.onShow();
  };
  const BarMenu = () => (
    <Menu
      className="dropdown-button"
      style={{ width: "100%" }}
      onClick={confiscateCredits}
    >
      {UserWalletOperations.map(
        (item) =>
          HasPermi(item.per) && (
            <Menu.Item
              key={item.key}
              onClick={(e) => {
                e.domEvent.stopPropagation();
              }}
            >
              {item.name}
            </Menu.Item>
          )
      )}
    </Menu>
  );
  const operations = (
    <Row className="color-white search-bar" align="middle">
      <Col
        className="display-flex"
        span={24}
        style={{ justifyContent: "flex-end" }}
      >
        <Select
          style={{ width: "15%" }}
          defaultValue="-1"
          onChange={(v) => setIs_freeze(v)}
        >
          <Option value="-1" key="-1">
            All
          </Option>
          <Option value="0" key="0">
            Never freeze
          </Option>
          <Option value="1" key="1">
            Has been frozen
          </Option>
        </Select>
        <Input
          className="width-200 margin-0"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ID / Email"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="width-46"
          onClick={btnQuery}
        />
        <Select
          style={{ width: "20%" }}
          className="margin-l10-r10"
          defaultValue="user_id"
          onChange={(v) => setDesc(v)}
        >
          {WalletDesc.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.desc}
            </Option>
          ))}
        </Select>
        <Dropdown
          overlay={BarMenu()}
          trigger={["click"]}
          placement="bottomRight"
          className="margin-right-10"
        >
          <Tooltip
            title={"More actions"}
            overlayStyle={{ whiteSpace: "nowrap" }}
          >
            <Button
              onClick={(e) => e.stopPropagation()}
              type="default"
              shape="circle"
              icon={<MoreOutlined />}
            ></Button>
          </Tooltip>
        </Dropdown>
      </Col>
    </Row>
  );
  const resultPage = () => {
    let failIds = [];
    const Tlength = tempData?.user.length;
    allRes.map(
      (item, index) => item.status === "rejected" && failIds.push(index)
    );
    return (
      <>
        <p className="text-bold font-size-15 text-align-center">
          Total {Tlength} Data Items, {Tlength - failIds.length} Completed,{" "}
          <span style={{ color: "red" }}>{failIds.length} Error</span>
        </p>
        {failIds.length > 0 && (
          <Row>
            <Col span={24} className="text-bold">
              Error Users ID:
            </Col>
            <Input.TextArea
              rows={4}
              value={failIds.map((item) => tempData?.user[item])}
            />
          </Row>
        )}
      </>
    );
  };
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
      <WriteLog
        title={logValues.title}
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
        tips={
          tempData.user.length > 1 &&
          `You input user count ${tempData.user.length}`
        }
      />
      <FrozenUserWallet
        submitLog={submitFrozen}
        ref={commonLogRef}
        title={logValues.title}
        tooltip="User ID"
      />
      <CreditsFromToST
        submit={() => {
          logModal.onShow();
        }}
        onData={(data, user) => {
          setTempData({ data, user });
          logModal.onShow();
        }}
        ref={creditsModal}
        title={logValues.title}
      />
      <Modal
        visible={errVisible}
        footer={[
          <Button
            key='1'
            onClick={() => {
              setErrVisible(false);
              creditsModal.current.cancel();
            }}
          >
            Close
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
        zIndex={1001}
      >
        {errVisible && resultPage()}
      </Modal>
      <Detail type='AccountWallet' ref={detailRef} />
    </div>
  );
};

export default UserWallet;

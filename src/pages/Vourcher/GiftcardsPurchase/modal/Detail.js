import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { Modal, Tabs, Row, Col, Button, message } from "antd";
import api from "../../../../components/Api";
import HasPermi from "../../../../components/CommonComponent/PermissionControl";
import { WalletDetail } from "../../../../components/CommonComponent/CommonConst";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
import FrozenPart from "./FrozenPart";
import "./detail.css";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import OperatorModal from "./TableDetail";
import Withdrawal from "./Withdrawal";
import AccountHistory from "./AccountHistory";
import FrozenList from "./FrozenList";

const { TabPane } = Tabs;

const Detail = React.forwardRef((props, ref) => {
  const { type } = props;
  const [visible, setVisible] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [curId, setCurId] = useState(null);
  const [detail, setDetailData] = useState(null);
  const [logTitle, setLogTitle] = useState("");
  const [activeKey, setActiveKey] = useState("1");
  const freezePartRef = useRef(null);
  const operatorModal = useRef();
  const withdrawalModal = useRef();
  const frozenListRef = useRef();
  const accountHistoryRef = useRef();

  useEffect(() => {
    visible &&
      api
        .get(`/wallet/user/${curId}?fetch_name=info`)
        .then((res) => {
          setDetailData(res?.data?.data);
        })
        .catch((err) => {
          message.error(err?.error?.msg);
        });
  }, [visible, curId, fresh]);

  useImperativeHandle(ref, () => ({
    open: (id) => {
      setCurId(id);
      setVisible(true);
    },
  }));
  const handleCloseDetail = () => {
    setVisible(false);
    setActiveKey("1");
  };
  const AFStatus = () => {
    let status = "";
    switch (activeKey) {
      case "1":
        if ([0, 2].includes(detail?.status)) {
          status = "Active";
        } else {
          status = "Frozen";
        }
        return status;
      case "2":
      case "3":
        if ([0, 1].includes(detail?.status)) {
          status = "Active";
        } else {
          status = "Frozen";
        }
        return status;
      default:
        return status;
    }
  };
  const viewCard = (item, value) => {
    return (
      <>
        <div>{item}</div>
        {item === "Wallet Freeze" 
        ? <span
              className="link-hover-underline blue"
              onClick={() => frozenListRef.current.open(activeKey)}
            >
              <strong className="text-bold-7 font-size-23">
                {commonFilter("centToUsd", value)}
              </strong>
            </span>
       : <strong className="text-bold-7 font-size-23">
          {commonFilter("centToUsd", value)}
         </strong>
        }
      </>
    );
  };
  const cardValueS = (item, index) => {
    const {
      sv,
      s_wallet_freeze_itc,
      s_deal_freeze_itc,
      purchase_itc,
      purchase_refund_itc,
    } = detail;
    switch (index) {
      case 0:
        return viewCard(item, sv + s_wallet_freeze_itc);
      case 1:
        return viewCard(item, sv - s_deal_freeze_itc);
      case 2:
        return viewCard(item, s_wallet_freeze_itc);
      case 3:
        return viewCard(item, s_deal_freeze_itc);
      case 4:
        return viewCard(item, purchase_itc);
      case 5:
        return viewCard(item, purchase_refund_itc);
      default:
        return null;
    }
  };
  const cardValueT = (item, index) => {
    const {
      tv,
      t_wallet_freeze_itc,
      withdraw_request_itc,
      t_deal_freeze_itc,
      withdraw_pending_itc,
      withdraw_itc,
    } = detail;
    switch (index) {
      case 0:
        return viewCard(item, tv + t_wallet_freeze_itc);
      case 1:
        return viewCard(item, tv - withdraw_request_itc);
      case 2:
        return viewCard(item, t_wallet_freeze_itc);
      case 3:
        return viewCard(item, withdraw_request_itc);
      case 4:
        return viewCard(item, t_deal_freeze_itc);
      case 5:
        return viewCard(item, withdraw_pending_itc);
      case 6:
        return viewCard(item, withdraw_itc);
      default:
        return null;
    }
  };
  const cardValueA = (item, index) => {
    const { av, affiliate } = detail;
    switch (index) {
      case 0:
        return viewCard(item, av);
      case 1:
        return viewCard(item, affiliate?.earn_itc);
      case 2:
        return viewCard(item, affiliate?.withdraw_itc);
      case 3:
        return viewCard(item, affiliate?.withdraw_pending_itc);
      case 4:
        return viewCard(item, affiliate?.withdraw_request_itc);
      default:
        return null;
    }
  };
  const everyCardData = (item, index) => {
    switch (activeKey) {
      case "1":
        return detail && cardValueS(item, index);
      case "2":
        return detail && cardValueT(item, index);
      case "3":
        return detail && cardValueA(item, index);
      default:
        return null;
    }
  };
  const viewModal = () => {
    switch (activeKey) {
      case "1":
        return (
          <>
            {detail?.sv > 0 && HasPermi(1002101) && (
              <span
                className="link-hover-underline blue"
                onClick={() =>
                  freezePartRef.current.open(
                    "Frozen Student Wallet Part",
                    activeKey
                  )
                }
              >
                Frozen Wallet Part
              </span>
            )}
            {HasPermi(1002100) && (
              <span
                className="link-hover-underline blue"
                onClick={() =>
                  openTable(2, `S Wallet : ${curId} Transaction Detail`)
                }
              >
                View Transaction
              </span>
            )}
            {HasPermi(1001100) && (
              <span
                className="link-hover-underline blue"
                onClick={() => openTable(1, "Recharge Detail")}
              >
                View Purchase Credits
              </span>
            )}
          </>
        );
      case "2":
        return (
          <>
            {detail?.tv > 0 && HasPermi(1002102) && (
              <span
                className="link-hover-underline blue"
                onClick={() =>
                  freezePartRef.current.open(
                    "Frozen Teacher Wallet Part",
                    activeKey
                  )
                }
              >
                Frozen Wallet Part
              </span>
            )}
            {HasPermi(1002100) && (
              <span
                className="link-hover-underline blue"
                onClick={() =>
                  openTable(4, `T Wallet : ${curId} Transaction Detail`)
                }
              >
                View Transaction
              </span>
            )}
            {HasPermi(1003100) && (
              <span
                className="link-hover-underline blue"
                onClick={() => openTable(5, "Withdraw Detail")}
              >
                View Withdrawal
              </span>
            )}
            {detail?.tv - detail?.withdraw_request_itc > 0 &&
              HasPermi(1003104) && (
                <span
                  className="link-hover-underline blue"
                  onClick={() => withdrawalModal.current.open(activeKey)}
                >
                  Withdraw
                </span>
              )}
          </>
        );
      case "3":
        return (
          <>
            {HasPermi(1002100) && (
              <span
                className="link-hover-underline blue"
                onClick={() =>
                  openTable(7, `A Wallet : ${curId} Transaction Detail`)
                }
              >
                View Transaction
              </span>
            )}
            {HasPermi(1003100) && (
              <span
                className="link-hover-underline blue"
                onClick={() => openTable(8, "Withdraw Detail")}
              >
                View Withdrawal
              </span>
            )}
            {detail?.av - detail?.withdraw_request_itc > 0 &&
              HasPermi(1003201) && (
                <span
                  className="link-hover-underline blue"
                  onClick={() => withdrawalModal.current.open(activeKey)}
                >
                  Withdraw
                </span>
              )}
          </>
        );
      default:
        return null;
    }
  };
  const accountFreeze = () => {
    logModal.onShow();
    switch (activeKey) {
      case "1":
        if (AFStatus() === "Active") {
          setLogTitle("Frozen Student Wallet");
        } else {
          setLogTitle("Unfrozen Student Wallet");
        }
        break;
      case "2":
        if (AFStatus() === "Active") {
          setLogTitle("Frozen Teacher Wallet");
        } else {
          setLogTitle("Unfrozen Teacher Wallet");
        }
        break;
      default:
        return null;
    }
  };
  const confirm = () => {
    let postData = {};
    switch (activeKey) {
      case "1":
        if (AFStatus() === "Active") {
          Reflect.set(postData, "operate", "frozen_sv");
        } else {
          Reflect.set(postData, "operate", "unfrozen_sv");
        }
        break;
      case "2":
        if (AFStatus() === "Active") {
          Reflect.set(postData, "operate", "frozen_tv");
        } else {
          Reflect.set(postData, "operate", "unfrozen_tv");
        }
        break;
      default:
        return null;
    }
    api
      .post(`/wallet/user/${curId}`, postData)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        if (success) {
          logModal.onCancel();
          setFresh(!fresh);
        }
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const openTable = (type, title) => {
    operatorModal.current.openModal(type, title);
  };
  return (
    <Modal
      visible={visible}
      onCancel={handleCloseDetail}
      destroyOnClose
      title={`${curId} Wallet Detail`}
      width={"66vw"}
      footer={null}
      maskClosable={false}
      className="card-container detail-modal-bg"
    >
      <Tabs
        type="card"
        tabBarGutter={0}
        onChange={(activeKey) => setActiveKey(activeKey)}
      >
        {WalletDetail.map((cur, index) => (
          <TabPane tab={cur.name} key={index + 1}>
            <h4 className="text-bold-7 font-size-18">
              {cur.name} (USD)
              {visible && ["1", "2"].includes(activeKey) ? (
                <>
                  {" "}
                  (
                  {['AccountWallet','all'].includes(type)
                  ? <span
                      className="link-hover-underline blue"
                      onClick={() => accountHistoryRef.current.open(activeKey)}
                    >
                      {AFStatus()}
                    </span>
                  : AFStatus()}
                  ){" "}
                </>
              ) : (
                " (Active)"
              )}
              &nbsp;
              {type === 'AccountWallet'
                ? null
                : ["1", "2"].includes(activeKey) && (
                    <Button type="primary" onClick={accountFreeze}>
                      {AFStatus() === "Active" ? "Freeze" : "Unfreeze"}
                    </Button>
                  )}
            </h4>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
              {cur.childs.map((item, k) => (
                <Col key={k} className="gutter-row" span={6}>
                  <div className="wallet-box">{everyCardData(item, k)}</div>
                </Col>
              ))}
            </Row>
            <p className="margin-top-10 wallet-detail-footer">{viewModal()}</p>
          </TabPane>
        ))}
      </Tabs>
      <FrozenPart
        ref={freezePartRef}
        curKey={activeKey}
        curId={curId}
        fresh={() => setFresh(!fresh)}
        maxValue={
          activeKey === "1"
            ? detail?.sv - detail?.s_deal_freeze_itc
            : activeKey === "2" && detail?.tv - detail?.withdraw_request_itc
        }
      />
      <OperatorModal userId={curId} ref={operatorModal} />
      <Withdrawal
        type='voucher'
        fresh={() => setFresh(!fresh)}
        userId={curId}
        ref={withdrawalModal}
      />
      <WriteLog
        title={logTitle}
        onRef={(ref) => setLogModal(ref)}
        onOk={confirm}
      />
      <FrozenList
        ref={frozenListRef}
        userId={curId}
        fresh={() => setFresh(!fresh)}
      />
      <AccountHistory
        ref={accountHistoryRef}
        userId={curId}
        fresh={() => setFresh(!fresh)}
      />
    </Modal>
  );
});

export default Detail;

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  message,
} from "antd";
import api from "../../../components/Api";
import CampaignInfo from "../Campaigns/Detail/CampaignInfo";
import OverviewInfo from "../Campaigns/Detail/OverviewInfo";
import UserConditionInfo from "../Campaigns/Detail/UserConditionInfo";
import TimeConditionInfo from "../Campaigns/Detail/TimeConditionInfo";
import PurchaseConditionInfo from "../Campaigns/Detail/PurchaseConditionInfo";

export default function Detail(props) {
  const { item: detail, visible, onCancel } = props;
  const [item, setItem] = useState({});

  async function getDetail(code) {
    try {
      let {
        data: { data },
      } = await api({
        url: `/voucher/campaign/${code}`,
        method: "get",
      });
      setItem(data);
    } catch (e) {
      e.response && message.error(e?.response?.data?.error?.msg);
    }
  }
  useEffect(() => {
    detail.voucher_category_code && getDetail(detail.voucher_category_code);
    // detail.condition_json && setCondition(JSON.parse(detail.condition_json));
  }, [detail.voucher_category_code, detail.condition_json]);
  const reloadDetail = (code) => {
    getDetail(code)
  }
  return (
    <Modal
      title={`${item?.category_code ?? ""} Detail`}
      visible={visible}
      width="80%"
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>Close</Button>}
      destroyOnClose
      maskClosable={false}
    >
      <>
        {
          JSON.stringify(item) !== '{}' &&
          <>
            <CampaignInfo item={item} type='campaigns' first getNewDetail={reloadDetail} />
            <OverviewInfo item={item} type='campaigns' />
            <UserConditionInfo item={item} type='campaigns' />
            <TimeConditionInfo item={item} type='campaigns' />
            <PurchaseConditionInfo item={item} type='campaigns' />
          </>
        }
      </>
    </Modal>
  );
}

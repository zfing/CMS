import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button} from 'antd';
import CampaignInfo from '../../Campaigns/Detail/CampaignInfo';
import OverviewInfo from '../../Campaigns/Detail/OverviewInfo';
import UserConditionInfo from '../../Campaigns/Detail/UserConditionInfo';
import TimeConditionInfo from '../../Campaigns/Detail/TimeConditionInfo';
import PurchaseConditionInfo from '../../Campaigns/Detail/PurchaseConditionInfo';

const ViewEdit = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    useImperativeHandle(ref, () => (
        {
            open: (item) => {
                setItem(item);
                setVisible(true);
            }
        }
    ))

    return (
        <Modal
            visible={visible}
            onCancel={() => setVisible(false)}
            destroyOnClose
            title={`${item?.voucher_name} Detail`}
            width={'88vw'}
            footer={[<Button key='1' onClick={() => setVisible(false)}>Close</Button>]}
        >
            <CampaignInfo item={item} type='general' newData={props.setData} />
            <OverviewInfo item={item} type='general' />
            <UserConditionInfo item={item} type='general' />
            <TimeConditionInfo item={item} type='general' />
            <PurchaseConditionInfo item={item} type='general' />
        </Modal>
    )
})

export default ViewEdit;
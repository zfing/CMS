import React, { useState, useImperativeHandle } from 'react';
import { Modal, Row, Col, Button, message } from 'antd';
import CampaignInfo from './CampaignInfo';
import OverviewInfo from './OverviewInfo';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';
import UserConditionInfo from './UserConditionInfo';
import TimeConditionInfo from './TimeConditionInfo';
import PurchaseConditionInfo from './PurchaseConditionInfo';
import api from "../../../../components/Api";

const Detail = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [titile, setTitle] = useState('');
    const specifyUserCount = null;
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
    const reloadDetail = (code) => {
        getDetail(code)
    }
    useImperativeHandle(ref, () => (
        {
            open: (modalTitle, selObj) => {
                setItem(selObj);
                setTitle(modalTitle);
                setVisible(true);
            }
        }
    ))
    const handleCloseDetail = () => {
        setVisible(false)
    }

    return (
        <Modal
            visible={visible}
            onCancel={handleCloseDetail}
            destroyOnClose
            title={titile}
            width={'88vw'}
            footer={[<Button key='1' onClick={handleCloseDetail}>Close</Button>]}
        >
            <Row gutter={[8, 8]}>
                {
                    item.specify_coupon === 1 && <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                Specified coupon, Assign coupon to user account.
                            </Col>
                            <Col span={12}>
                                {
                                    item.specify_start_date &&
                                    <span>
                                        Between
                                        {commonFilter('fDate', item.specify_start_date)}
                                        and
                                        {commonFilter('fDate', item.specify_end_date)} (UTC)
                                    </span>
                                }
                                <span>
                                    {
                                        !item.specify_start_date && 'Immediately'
                                    }
                                    sent to users
                                </span>
                            </Col>
                        </Row>
                        {
                            item.finish_flag === 0 && <Row gutter={[8, 8]}>
                                <Col span={4}>
                                    New application
                                </Col>
                                <Col span={12} className="color-red">
                                    Currently there are
                                    <strong>{specifyUserCount}</strong>
                                    users to meet the conditions.
                                </Col>
                            </Row>
                        }
                    </Col>
                }
                {
                    item.category_code !== 'GIFTCARD' &&
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <span>
                                    {
                                        item.condition === 1
                                            ? `Total maximum amount allowed to generate vouchers:`
                                            : `Total maximum amount allowed to generate coupons:`
                                    }
                                </span>
                                <span className="text-semibold">
                                    &nbsp;
                                    {
                                        item.voucher_amount === -1
                                            ? 'Unlimited'
                                            : item.voucher_amount
                                    }
                                </span>
                            </Col>
                            <Col span={12}>
                                {
                                    item.condition === 1
                                        ? `Maximum amount per time allowed to generate vouchers:`
                                        : `Maximum amount per time allowed to generate coupons:`
                                }
                                <span className="text-semibold">
                                    &nbsp;
                                    {item.voucher_once_count}
                                </span>
                            </Col>

                        </Row>
                    </Col>
                }
            </Row>
            <CampaignInfo item={item}
                type='campaigns'
                getNewDetail={reloadDetail}
                needFreshDate={props.needFreshDate}
            />
            <OverviewInfo item={item} type='campaigns' />
            <UserConditionInfo item={item} type='campaigns' />
            <TimeConditionInfo item={item} type='campaigns' />
            <PurchaseConditionInfo item={item} type='campaigns' />
        </Modal>
    )
})

export default Detail;
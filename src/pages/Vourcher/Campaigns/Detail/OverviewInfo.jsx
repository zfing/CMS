import React from 'react';
import { Row, Col } from 'antd';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';

const OverviewInfo = React.forwardRef((props, ref) => {
    const { item, type } = props;
    const flag = type === 'campaigns'
    const types = item.condition === 1 ? 'Vouchers' : 'Coupons';
    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top"></div>
                </Col>
            </Row>
            <Row gutter={[8, 8]} className="padding-0-10 card-view-edit">
                <Col span={8} className="text-semibold">
                    {flag ? 'Usage# for the same user' : 'Usage# Remaining number of times'}
                </Col>
                <Col span={16}>
                    {
                        flag
                            ? <span>({item.usage_limit}) {item.usage_limit === 0 ? 'Unlimited' : 'One only'}</span>
                            : <span>{item.remain_number > -1
                                ? `${item.remain_number} time(s)`
                                : 'Unlimited use'}
                            </span>
                    }
                </Col>
                <Col span={8} className="text-semibold">
                    {
                        flag ? `All Generated ${types}` : 'Usage# for the same user'
                    }
                </Col>
                <Col span={16}>
                    {
                        flag
                            ? <span>Total 
                                <strong className="padding-right-5">
                                {item.voucher_count || 0}
                                </strong>{types},
                                <strong className="padding-left-5">
                                    {commonFilter('centToUsd', item.all_itc)}&nbsp;USD
                                </strong>
                              </span>
                            : <span>
                                ({item.user_use_number})&nbsp;
                                {item.user_use_number === -1 
                                    ? 'Unlimited' 
                                    : 'One only'}
                              </span>
                    }
                </Col>
                <Col span={8} className="text-semibold">
                    Already used {flag ? types : 'coupons'}
                </Col>
                <Col span={16}>
                    Total <strong className="padding-0-5">{item.used_count || 0}</strong>
                    {flag ? types : 'coupons'},
                    <strong className="padding-0-5">
                        {
                            commonFilter('centToUsd', item.used_itc)
                        }
                    </strong>
                    USD
                </Col>
            </Row>
        </>
    )
})

export default OverviewInfo;
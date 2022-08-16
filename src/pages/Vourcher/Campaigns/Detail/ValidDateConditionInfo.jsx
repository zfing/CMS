import React from 'react';
import { Row, Col } from 'antd';
// import { sessionTypes } from "../CommonConst";
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';

const ValidDateConditionInfo = React.forwardRef((props, ref) => {
    const { item } = props;
    const type = item.condition === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item.condition_json);

    const showInfo = [
        {
            title: 'Valid Date Condition',
            desc: <span>
                {condition?.ValidDateCondition?.ValidDateRange?.Start
                    ? `${commonFilter('fDate', condition.ValidDateCondition?.ValidDateRange?.Start, 'YYYY-MM-DD')} to ${commonFilter('fDate', condition?.ValidDateCondition?.ValidDateRange?.End, 'YYYY-MM-DD')}`
                    : 'Unlimited'
                }
            </span>
        },
        {
            title: 'Valid Days',
            desc: <span>
                {condition?.ValidDateCondition?.ValidDays || 'Unlimited'}
            </span>
        }
    ]

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        Valid Date condition of {
                            item.specify_coupon === 1
                                ? 'triggering'
                                : 'using'
                        }
                        &nbsp;
                        {type}
                        <span className="text-semibold float-right">
                            All below
                        </span>
                    </div>
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                {
                    showInfo.map((selObj, index) => (
                        <Col span={12} key={index}>
                            <Row gutter={[8, 8]}>
                                <Col span={8} className='font-weight-bolder'>
                                    {selObj.title}
                                </Col>
                                <Col span={16}>
                                    {selObj.desc}
                                </Col>
                            </Row>
                        </Col>
                    ))
                }
            </Row>

        </>
    )
})

export default ValidDateConditionInfo;
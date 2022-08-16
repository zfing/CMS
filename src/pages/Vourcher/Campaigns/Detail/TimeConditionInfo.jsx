import React from 'react';
import { Row, Col } from 'antd';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';

const TimeConditionInfo = React.forwardRef((props, ref) => {
    const { item } = props;
    const type = item.condition === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item.condition_json);
    const showInfo = [
        {
            title: 'Register time',
            desc: <span>
                {
                    condition?.TimeCondition?.RegRange
                        ? `${commonFilter('fDate', condition.TimeCondition.RegRange.Start)} to ${commonFilter('fDate', condition.TimeCondition.RegRange.End)}`
                        : 'Unlimited'
                }

            </span>
        },
        {
            title: 'Login within',
            desc: <span>
                {
                    condition?.TimeCondition?.LoginDays > 0
                        ? `${condition.TimeCondition.LoginDays} day(s)`
                        : 'Unlimited'
                }
            </span>
        },
        {
            title: "Registered user with x days who didn't make any purchase",
            desc: <span>
                {
                    condition?.TimeCondition?.SuspendRegDays > 0
                        ? `${condition.TimeCondition.SuspendRegDays} day(s)`
                        : 'Unlimited'
                }
            </span>
        }

    ]

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        Time condition of {
                            item.specify_coupon === 1
                                ? 'triggering'
                                : 'using'
                        }
                        &nbsp;
                        {type}
                        <span className="text-semibold float-right">
                            {
                                condition?.TimeCondition?.AllAbove > 0
                                    ? 'All below'
                                    : 'Either of those below'
                            }
                        </span>
                    </div>
                </Col>
            </Row>
            <Row gutter={[8, 8]} className='card-view-edit'>
                {
                    showInfo.map((selObj, index) => (
                        <Col span={index === 2 ? 24 : 12} key={index}>
                            <Row gutter={[8, 8]}>
                                <Col span={index === 2 ? 12 : 8} className='font-weight-bolder'>
                                    {
                                        selObj.title
                                    }
                                </Col>
                                <Col span={index === 2 ? 12 : 16}>
                                    {
                                        selObj.desc
                                    }
                                </Col>
                            </Row>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
})

export default TimeConditionInfo;
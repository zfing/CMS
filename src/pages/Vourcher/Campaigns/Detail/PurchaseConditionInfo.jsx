import React from 'react';
import { Row, Col } from 'antd';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';

const PurchaseConditionInfo = React.forwardRef((props, ref) => {
    const { item } = props;
    const type = item.condition === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item.condition_json);

    const showInfo = [
        {
            title: 'Lesson status',
            desc: <span>
                {
                    {
                        '1': 'Lesson requested',
                        '2': 'Lesson completed',
                    }[condition?.PurchaseCondition?.LessonStatus] || 'Unlimited'
                }
            </span>
        },
        {
            title: 'Package status',
            desc: <span>
                {
                    {
                        '1': 'Package requested',
                        '2': 'Package completed'
                    }[condition?.PurchaseCondition?.PackageStatus] || 'Unlimited'
                }
            </span>
        },
        {
            title: 'Credits purchased',
            desc: <><span>
                {
                    condition?.PurchaseCondition?.BoughtITC > 0 && `${commonFilter('centToUsd', condition?.PurchaseCondition?.BoughtITC)} USD`
                }
                <span>
                    {
                        condition?.PurchaseCondition?.BoughtTimeRange && `Duration ${commonFilter('fDate', condition?.PurchaseCondition?.BoughtTimeRange.Start, 'YYYY-MM-DD')} to ${commonFilter('fDate', condition?.PurchaseCondition?.BoughtTimeRange.End, 'YYYY-MM-DD')}`
                    }
                </span>
            </span>
                <span>{!condition?.PurchaseCondition && !condition?.PurchaseCondition?.BoughtITC && 'Unlimited'}</span>
            </>
        },
        {
            title: 'Other products',
            desc: <span>
                {
                    {
                        '1': 'OOPT',
                    }[condition?.PurchaseCondition?.BoughtProduct] || 'Unlimited'
                }
            </span>
        }
    ]

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        Purchase condition of {
                            item.specify_coupon === 1
                                ? 'triggering'
                                : 'using'
                        }
                        &nbsp;
                        {type}
                        <span className="text-semibold float-right">
                            {
                                condition?.PurchaseCondition?.AllAbove > 0
                                    ? 'All below'
                                    : 'Either of those below'
                            }
                        </span>
                    </div>
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                {
                    showInfo.map((selObj, index) => (
                        <Col span={12} key={index}>
                            {/* <Col span={index === 2 ? 24 : 12} key={index}> */}
                            <Row gutter={[8, 8]}>
                                <Col span={8} className='font-weight-bolder'>
                                    {/* <Col span={index === 2 ? 16 : 8}> */}
                                    {
                                        selObj.title
                                    }
                                </Col>
                                <Col span={16}>
                                    {/* <Col span={index === 2 ? 8 : 16}> */}
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

export default PurchaseConditionInfo;
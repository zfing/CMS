import React from 'react';
import { Row, Col } from 'antd';

const LanguageTestConditionInfo = React.forwardRef((props, ref) => {
    const { item } = props;
    const type = item.condition === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item.condition_json);

    const showInfo = [
        {
            title: 'Language Test Type',
            desc: <span>
                {condition?.ProductCondition?.Type || 'Unlimited'}
            </span>
        }
    ]

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        Language test condition of {
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

export default LanguageTestConditionInfo;
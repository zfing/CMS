import React from 'react';
import { Row, Col, Tag } from 'antd';
import { sessionTypes } from "../../CommonConst";

const SessionConditionInfo = React.forwardRef((props, ref) => {
    const { item } = props;
    const type = item.condition === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item.condition_json);

    const showInfo = [
        {
            title: 'Lesson Language',
            desc: <span>
                {condition?.SessionCondition?.SessionLanguage || 'Unlimited'}
            </span>
        },
        {
            title: 'Lesson Type',
            desc: <span>
                {condition?.SessionCondition?.SessionType 
                    ? condition.SessionCondition.SessionType.split(',').map((item, index) => <Tag className='margin-bottom-5' key={index}>{sessionTypes[item]}</Tag>)
                    : 'Unlimited'
                }
                {/* {sessionTypes[condition?.SessionCondition?.SessionType] || 'Unlimited'} */}
            </span>
        }
    ]
    if(condition?.SessionCondition?.UseLimitMaxITC >= 0) {
        showInfo.push({
            title: 'Max Lesson Price',
            desc: <span>
                {condition.SessionCondition.UseLimitMaxITC / 100}
            </span>
        })
    }
    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        Session condition of {
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
                    showInfo.map((selObj, index) => <Col span={12} key={index}>
                            <Row gutter={[8, 8]}>
                                <Col span={8} className='font-weight-bolder'>
                                    {selObj.title}
                                </Col>
                                <Col span={16}>
                                    {selObj.desc}
                                </Col>
                            </Row>
                        </Col>
                    )
                }
            </Row>
        </>
    )
})

export default SessionConditionInfo;
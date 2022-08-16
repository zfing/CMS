import React from 'react';
import { Row, Col } from 'antd';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';
import { voucherUserIdentity, voucherRefSource, countryObjs, languageObjs } from '../../CommonConst';

const UserConditionInfo = React.forwardRef((props, ref) => {
    const { 
        item, 
        // type 
    } = props;
    const types = item.condtion === 1 ? 'Voucher' : 'Coupon';
    const condition = JSON.parse(item?.condition_json);

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <div className="form-title-top">
                        User condition of {
                            item.specify_coupon === 1
                                ? 'triggering'
                                : 'using'
                        }
                        &nbsp;
                        {types}
                        <span className="text-semibold float-right">
                            All below
                        </span>
                    </div>
                </Col>
            </Row>
            <Row gutter={[8, 8]} className='card-view-edit'>
                <Col span={4} className="text-semibold">
                    User identity
                </Col>
                <Col span={8}>
                    {
                        commonFilter(voucherUserIdentity, condition?.UserCondition?.UserIdentity, 'Unlimited')
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    Source
                </Col>
                <Col span={8}>
                    {
                        commonFilter(voucherRefSource, condition?.UserCondition?.RefSource, 'Unlimited')
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    From
                </Col>
                <Col span={8}>
                    {
                        commonFilter(countryObjs, condition?.UserCondition?.FromCountry, 'Unlimited')
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    Native Language
                </Col>
                <Col span={8}>
                    {
                        commonFilter(languageObjs, condition?.UserCondition?.NativeLanguage, 'Unlimited')
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    Learning
                </Col>
                <Col span={8}>
                    {
                        commonFilter(languageObjs, condition?.UserCondition?.LearnLanguage, 'Unlimited')
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    Teaching
                </Col>
                <Col span={8}>
                    {
                        commonFilter(languageObjs, condition?.UserCondition?.TeachLanguage, 'Unlimited')
                    }
                </Col>
            </Row>

        </>
    )
})

export default UserConditionInfo;
import React, { useState, useRef, useEffect } from 'react';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';
import { Row, Col, Tag } from 'antd';
import { voucherAccount, channelType, voucherCategoryStatus, voucherConditionJson, voucherCondition } from '../../CommonConst'

const VoucherCode = {
    backgroundColor: '#444',
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    padding: '4px 6px'
}
const CampaignInfo = React.forwardRef((props, ref) => {
    const flag = props.type === 'campaigns'
    const mounting = useRef();
    const [item, setItem] = useState(props.item)
    useEffect(() => {
        if (!mounting.current && flag) {
            mounting.current = true;
            return
        }
        flag && setItem(props.item)
    }, [props, flag])
    const ColArr =
    {
        name: <>
            <Col span={4} className="text-semibold"> Coupon Name </Col>
            <Col span={8}> {item?.voucher_name} </Col>
        </>,
        desc: <>
            <Col span={4} className="text-semibold">Campaign Desc</Col>
            <Col span={8}> {item?.remark}</Col>
        </>,
        creator: <>
            <Col span={4} className="text-semibold">Creator</Col>
            <Col span={8}>{item?.admin_name}</Col>
        </>,
        date: <>
            <Col className="text-semibold" span={4}> Create date </Col>
            <Col span={8}>{commonFilter('fDate', item.create_time)}</Col>
        </>
    }
    const viewOrder = () => {
        if (flag) {
            return <>{ColArr.creator}{ColArr.date}{ColArr.desc}</>
        } else {
            return <>{ColArr.name}{ColArr.desc}{ColArr.creator}{ColArr.date}</>
        }
    }
    return (
        <>
            {
                flag && <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div className={props.first ? '' : 'form-title-top'}>
                            Campaign Info
                        </div>
                    </Col>
                </Row>
            }
            <Row gutter={[8, 8]} className="padding-0-10 basic-information">
                <Col span={4} className="text-semibold">
                    {flag ? 'Campaign Code' : 'Coupon Code'}
                </Col>
                <Col span={8}>
                    {flag
                        ? item.category_code
                        : <Tag style={VoucherCode}>
                            {item?.voucher_code}
                        </Tag>}
                </Col>
                <Col span={4} className="text-semibold">
                    Account
                </Col>
                <Col span={8}>
                    {commonFilter(voucherAccount, item.account_code)} - {item.show_type} - {commonFilter(channelType, item.regional)}
                </Col>
                <Col span={4} className="text-semibold">
                    Validity Period
                </Col>
                <Col span={8}>
                    {
                        commonFilter('fDate', item.start_time)
                    }
                        &nbsp;to&nbsp;
                        {
                        commonFilter('fDate', item.end_time)
                    } (UTC)
                </Col>
                <Col span={4} className="text-semibold">
                    {flag ? 'Campaign Status' : 'Coupon Status'}
                </Col>
                <Col span={8}>
                    <Tag color="#2db7f5" className='text-bold-7 default-font'>
                        {
                            flag
                                ? commonFilter(voucherCategoryStatus, item?.finish_flag)
                                : commonFilter(voucherCategoryStatus, item?.status)
                        }
                    </Tag>
                </Col>
                <Col span={4} className="text-semibold">
                    {
                        flag
                            ? (item.condition === 1 ? 'Voucher Value' : 'Coupon Value')
                            : 'Coupon Value'
                    }
                </Col>
                <Col span={8}>
                    {
                        flag
                            ? (item.voucher_value
                                ? <span>
                                    <strong>{commonFilter('centToUsd', item.voucher_value)}&nbsp;</strong>
                                        USD Credits
                                    </span>
                                : <span>
                                    Custom {item.condition === 1 ? 'Voucher' : 'Coupon'} Value
                                     </span>)
                            : <span>$
                                <strong>
                                    {commonFilter('centToUsd', item.voucher_value)}&nbsp;
                                </strong>USD
                                </span>
                    }
                </Col>
                <Col span={4} className="text-semibold">
                    Condition Type
                </Col>
                <Col span={8}>
                    {
                        flag
                            ? <span>({item.condition}) &nbsp; {voucherConditionJson(item.condition, item.voucher_value, item.condition_json, true)}</span>
                            : <span>({item.voucher_condition}) &nbsp; {voucherCondition(item.voucher_condition, item?.condition_json, commonFilter('centToUsd', item?.voucher_value))}</span>
                    }

                </Col>
                {viewOrder()}
                {
                    [1, 3].includes(JSON.parse(item?.condition_json)?.UseType) &&
                    <>
                        <Col className="text-semibold" span={4}> Can Use Balance </Col>
                        <Col span={8}>
                            {['NO','YES'][JSON.parse(item?.condition_json)?.CanUseBalance]}
                        </Col>
                    </>
                }
            </Row>
        </>
    )

})

export default CampaignInfo;
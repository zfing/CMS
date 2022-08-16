import React, { useState, useImperativeHandle, useRef } from 'react';
import { Descriptions, Button, Modal, Row, Col, Select, Tooltip, DatePicker, Input } from 'antd';
import { validDateCondition } from '../../CommonConst';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';

const { RangePicker } = DatePicker;

const UsetypeVoucher = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [modalObj, setModalObj] = useState({});
    const inputRef = useRef(null);

    const openModal = () => {
        setVisible(true);
    }

    const confirm = () => {
        setResultObj({
            ...modalObj,
            validDays: Number(inputRef?.current?.state?.value)
        });
        setVisible(false);
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "ValidDateRange": resultObj.start_time && resultObj.end_time ? { "Start": resultObj?.start_time ? moment(resultObj.start_time).format().replace('+08:00','') : '', "End": resultObj?.end_time ? moment(resultObj.end_time).format().replace('+08:00','') : '' } : '',
                })
                if (resultObj.type === '1') {
                    temp = deleteEmptyProperty({
                        "ValidDateRange": resultObj.start_time && resultObj.end_time ? { "Start": resultObj?.start_time ? moment(resultObj.start_time).format().replace('+08:00','') : '', "End": resultObj?.end_time ? moment(resultObj.end_time).format().replace('+08:00','') : '' } : '',
                    })
                } else {
                    temp = deleteEmptyProperty({
                        "ValidDays": resultObj?.validDays
                    })
                }
            }
            return temp;
        }
    }))
    const descriptionObj = {
        0: ['Coupon Valid Start Date(UTC)', !!commonFilter('fDate', resultObj?.start_time) ? commonFilter('fDate', resultObj?.start_time) : 'Unlimited'],
        1: ['Coupon Valid End Date(UTC)', !!commonFilter('fDate', resultObj?.end_time) ? commonFilter('fDate', resultObj?.end_time) : 'Unlimited'],
        2: ['Coupon Valid Days', resultObj?.validDays ? resultObj?.validDays : 'Unlimited']
    }

    return (
        <>
            <Descriptions
                column={2}
                title={
                    <span>
                        <span>④</span>Valid Date Condition of triggering coupons
            <Button type="link" onClick={openModal}>
                            Edit
            </Button>
                    </span>
                }>
                {
                    [0, 1, 2].map((item) => {
                        return <Descriptions.Item key={item} label={descriptionObj[item][0]}>
                            {descriptionObj[item][1]}
                        </Descriptions.Item>
                    })
                }
            </Descriptions>
            <Modal
                visible={visible}
                title={'Valid Date condition of vouchers'}
                onCancel={() => setVisible(false)}
                destroyOnClose
                onOk={confirm}
                width={'550px'}
            >
                <Row gutter={[8, 8]}>
                    <Col span={10} className="frank-end">
                        <Tooltip placement="bottom" title="如果不填写voucher有效时间，那么就默认选用活动有效时间">
                            Voucher Valid Date Condition <QuestionCircleOutlined />
                        </Tooltip>
                    </Col>
                    <Col span={14}>
                        <Select
                            allowClear={true}
                            defaultValue={resultObj?.type}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            optionFilterProp="label"
                            onChange={(value) => setModalObj({ type: value })}
                            options={translateOptions(validDateCondition)}
                        >
                        </Select>
                    </Col>
                    <Col span={10} className="frank-end">
                    </Col>
                    <Col span={14}>
                        {
                            modalObj.type === '1'
                                ?
                                <RangePicker
                                    showTime={{
                                        hideDisabledOptions: false,
                                        defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                                    }}
                                    defaultValue={resultObj?.start_time && resultObj?.end_time ? [moment(resultObj?.start_time), moment(resultObj?.end_time)] : []}
                                    className="width-hundred-percent margin-top-5"
                                    format='YYYY-MM-DD HH:mm'
                                    disabledDate={(current) => current && current < moment().startOf('day')}
                                    ranges={{
                                        'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                                        'This Year': [moment().startOf('year'), moment().endOf('year')]
                                    }}
                                    onChange={(data, datastring) => setModalObj({ ...modalObj, start_time: datastring[0], end_time: datastring[1] })}
                                />
                                :
                                modalObj.type === '2'
                                    ? <Input defaultValue={resultObj?.validDays} ref={inputRef} />
                                    : ''
                        }
                    </Col>
                </Row>
            </Modal>
        </>
    )
})

export default UsetypeVoucher;
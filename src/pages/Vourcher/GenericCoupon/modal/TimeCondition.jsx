import React, { useState, useRef, useImperativeHandle } from 'react';
import { Descriptions, DatePicker, Row, Col, Tooltip, Select, Input, Radio } from 'antd';
import { duration } from '../../CommonConst';
import { translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';
import moment from 'moment';

const { RangePicker } = DatePicker;

const TimeCondition = React.forwardRef((props, ref) => {
    // const [resultObj, setResultObj] = useState({});
    const [modalObj, setModalObj] = useState({});
    const loginDurationRef = useRef(null);
    const suspendDurationRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "AllAbove": modalObj.isAllAbove ? modalObj.isAllAbove : '0',
                    "RegRange": modalObj.start_time && modalObj.end_time ? { "Start": modalObj?.start_time ? moment(modalObj.start_time).format().replace('+08:00','') : '', "End": modalObj?.end_time ? moment(modalObj.end_time).format().replace('+08:00','') : '' } : '',
                    "LoginDays": loginDurationRef?.current?.state?.value ? loginDurationRef.current.state.value : '',
                    "SuspendRegDays": suspendDurationRef?.current?.state?.value ? suspendDurationRef.current.state.value : ''
                })
            }
            return temp;
        }
    }))

    return (
        <>
            <Descriptions
                className='description-top'
                column={2}
                title={<span> ② Time condition of using vouchers</span>}
            />
            <Row gutter={[8, 8]}>
                <Col span={4} className="frank-end">
                    Register Time
                </Col>
                <Col span={6}>
                    <RangePicker
                        showTime={{
                            hideDisabledOptions: false,
                            defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                        }}
                        defaultValue={modalObj?.start_time && modalObj?.end_time ? [moment(modalObj?.start_time), moment(modalObj?.end_time)] : []}
                        className="width-hundred-percent margin-top-5"
                        format='YYYY-MM-DD HH:mm'
                        ranges={{
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                            'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                            'This Year': [moment().startOf('year'), moment().endOf('year')],
                            'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
                        }}
                        onChange={(data, datastring) => setModalObj({ ...modalObj, start_time: datastring[0], end_time: datastring[1]})}
                    />
                </Col>
                <Col span={4} className="frank-end">
                    <Tooltip placement="bottom" title="Login within x days">
                        Login duration <i className='fa fa-question-circle' />
                    </Tooltip>
                </Col>
                <Col span={4}>
                    <Select
                        defaultValue={modalObj?.login_type ? modalObj.login_type : ''}
                        className="width-hundred-percent"
                        onChange={(value) => {
                            if (value !== '0') {
                                loginDurationRef.current.state.value = value;
                            } else {
                                loginDurationRef.current.state.value = '';
                            }
                            setModalObj({ ...modalObj, login_type: value })
                        }}
                        options={translateOptions(duration)}
                    >
                    </Select>
                </Col>
                <Col span={4}>
                    <Input
                        onInput={
                            (e) => {
                                if (e?.target?.value) {
                                    e.target.value = e.target.value < 1 ? 1 : e.target.value
                                }
                            }}
                        onKeyUp={
                            (e) => {
                                if (e?.target?.value) {
                                    e.target.value = e.target.value.replace(/[^0-9.]+/g, '')
                                }
                            }
                        }
                        defaultValue={modalObj?.login_duration}
                        ref={loginDurationRef}
                        disabled={modalObj?.login_type !== '0'} />
                </Col>
                <Col span={4} className="frank-end">
                    <Tooltip placement="bottom" title="Registered user with x days (who didn't make any purchase)">
                        Suspend duration  <i className='fa fa-question-circle' />
                    </Tooltip>
                </Col>
                <Col span={3}>
                    <Select
                        defaultValue={modalObj?.suspend_type ? modalObj.suspend_type : ''}
                        className="width-hundred-percent"
                        disabled={props.identity === '2'}
                        onChange={(value) => {
                            if (value !== '0') {
                                suspendDurationRef.current.state.value = value
                            } else {
                                suspendDurationRef.current.state.value = ''
                            }
                            setModalObj({ ...modalObj, suspend_type: value })
                        }}
                        options={translateOptions(duration)}
                    >
                    </Select>
                </Col>
                <Col span={3}>
                    <Input
                        defaultValue={modalObj.suspend_duration}
                        ref={suspendDurationRef}
                        disabled={modalObj?.suspend_type !== '0'} />
                </Col>
                <Col span={8} className="frank-end">
                    <Radio.Group
                        defaultValue={modalObj.isAllAbove ? modalObj.isAllAbove : '0'}
                        onChange={(e) => setModalObj({ ...modalObj, isAllAbove: e.target.value })}>
                        <Radio value="0">
                            Either of those above
                        </Radio>
                        <Radio value="1">
                            All above
                        </Radio>
                    </Radio.Group>
                </Col>
            </Row>
        </>
    )
})

export default TimeCondition;
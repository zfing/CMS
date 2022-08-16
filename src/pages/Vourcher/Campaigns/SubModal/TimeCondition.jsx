import React, { useState, useRef, useImperativeHandle } from 'react';
import { Modal, Descriptions, Button, DatePicker, Row, Col, Tooltip, Select, Input, Radio } from 'antd';
import DescriptionsItem from 'antd/lib/descriptions/Item';
import { isAllAbove, duration } from '../../CommonConst';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction'
import moment from 'moment';

const { RangePicker } = DatePicker;

const TimeCondition = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [modalObj, setModalObj] = useState({});
    const [visible, setVisible] = useState(false);
    const loginDurationRef = useRef(null);
    const suspendDurationRef = useRef(null);

    const openModal = () => {
        setVisible(true);
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "AllAbove": resultObj.isAllAbove ? resultObj.isAllAbove : '0',
                    "RegRange": modalObj.start_time && modalObj.end_time ? { "Start": modalObj?.start_time ? moment(modalObj.start_time).format().replace('+08:00','') : '', "End": modalObj?.end_time ? moment(modalObj.end_time).format().replace('+08:00','') : '' } : '',
                    "LoginDays": resultObj?.login_duration ? resultObj?.login_duration : '',
                    "SuspendRegDays": resultObj?.suspend_duration ? resultObj?.suspend_duration : ''
                })
            }
            return temp;
        }
    }))

    const confirm = () => {
        setResultObj({
            isAllAbove: '0',
            ...modalObj,
            login_duration: loginDurationRef?.current?.state?.value ? loginDurationRef.current.state.value : '',
            suspend_duration: suspendDurationRef?.current?.state?.value ? suspendDurationRef.current.state.value : '',
        });
        setVisible(false);
    }


    const descriptionObj = {
        0: ['Register Start time(UTC)', !!commonFilter('fDate', resultObj?.start_time) ? commonFilter('fDate', resultObj?.start_time) : 'Unlimited'],
        1: ['Register End time(UTC)', !!commonFilter('fDate', resultObj?.end_time) ? commonFilter('fDate', resultObj?.end_time) : 'Unlimited'],
        2: ['Login Duration', resultObj?.login_duration ? resultObj?.login_duration : 'Unlimited'],
        3: ['Suspend Duration', resultObj?.suspend_duration ? resultObj?.suspend_duration : 'Unlimited'],
        4: ['Either of those above Or All above', commonFilter(isAllAbove, resultObj?.isAllAbove, 'Unlimited')]
    }

    return (
        <>
            <Descriptions
                column={2}
                title={
                    <span>
                        ② Time condition of using vouchers
                        <Button type="link" onClick={openModal}>
                            Edit
                        </Button>
                    </span>
                }
            >
                {
                    [0, 1, 2, 3, 4].map((item) => (
                        <DescriptionsItem key={`description_${item}`} label={descriptionObj[item][0]}>
                            {descriptionObj[item][1]}
                        </DescriptionsItem>
                    ))
                }
            </Descriptions>
            <Modal
                visible={visible}
                destroyOnClose
                title="Time condition of vouchers"
                onCancel={() => setVisible(false)}
                onOk={confirm}
                width={'620px'}
            >
                <Row gutter={[8, 8]}>
                    <Col span={6} className="frank-end">
                        Register Time
                    </Col>
                    <Col span={18}>
                        <RangePicker
                            showTime={{
                                hideDisabledOptions: false,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                            }}
                            defaultValue={resultObj?.start_time && resultObj?.end_time ? [moment(resultObj?.start_time), moment(resultObj?.end_time)] : []}
                            className="width-hundred-percent margin-top-5"
                            format='YYYY-MM-DD HH:mm'
                            ranges={{
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                                'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                                'This Year': [moment().startOf('year'), moment().endOf('year')],
                                'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
                            }}
                            onChange={(data, datastring) => {
                                console.log(moment(datastring[0]).format())
                                setModalObj({ ...modalObj, start_time: datastring[0], end_time: datastring[1] })
                            }}
                        />
                    </Col>
                    <Col span={6} className="frank-end">
                        <Tooltip placement="bottom" title="Login within x days">
                            Login duration <QuestionCircleOutlined />
                        </Tooltip>
                    </Col>
                    <Col span={9}>
                        <Select
                            defaultValue={resultObj?.login_type ? resultObj.login_type : ''}
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
                    <Col span={9}>
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
                            defaultValue={resultObj?.login_duration}
                            ref={loginDurationRef}
                            disabled={modalObj?.login_type !== '0'} />
                    </Col>
                    <Col span={6} className="frank-end">
                        <Tooltip placement="bottom" title="Registered user with x days (who didn't make any purchase)">
                            Suspend duration  <QuestionCircleOutlined />
                        </Tooltip>
                    </Col>
                    <Col span={9}>
                        <Select
                            defaultValue={resultObj?.suspend_type ? resultObj.suspend_type : ''}
                            className="width-hundred-percent"
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
                    <Col span={9}>
                        <Input
                            defaultValue={resultObj.suspend_duration}
                            ref={suspendDurationRef}
                            disabled={modalObj?.suspend_type !== '0'} />
                    </Col>
                    <Col span={24} className="frank-end">
                        <Radio.Group
                            defaultValue={resultObj.isAllAbove ? resultObj.isAllAbove : '0'}
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

            </Modal>
        </>
    )
})

export default TimeCondition;
import React, { useState, useRef, useImperativeHandle } from 'react';
import { Descriptions, Row, Col, Select, Input, DatePicker, Radio } from 'antd';
import { translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';
import { lessonStatus, packageStatus, otherProducts, creditsPurchase } from '../../CommonConst'
import moment from 'moment';

const { RangePicker } = DatePicker;

const PurchaseCondition = React.forwardRef((props, ref) => {
    // const [modalObj, setResultObj] = useState({});
    const [modalObj, setModalObj] = useState({});
    const [selectCredit, setSelectCredit] = useState();
    const creaditsPurchaseRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "AllAbove": modalObj.isAllAbove ? modalObj.isAllAbove : '0' || '0',
                    "BoughtUSD": modalObj?.credits_purchase ? modalObj.credits_purchase : '',
                    "BoughtITC": Number(modalObj?.credits_purchase ? modalObj.credits_purchase : 0) * 100,
                    "BoughtProduct": Number(modalObj?.other_products ? modalObj.other_products : ''),
                    "LessonStatus": Number(modalObj?.lesson_status ? modalObj.lesson_status : ''),
                    "PackageStatus": Number(modalObj?.package_status ? modalObj.package_status : ''),
                    "BoughtTimeRange": modalObj?.purchase_start_time && modalObj?.purchase_end_time ? { "Start": moment(modalObj?.purchase_start_time).format().replace('+08:00', ''), "End": moment(modalObj?.purchase_end_time).format().replace('+08:00', '') } : '',
                    "NotBoughtTimeRange": modalObj?.limit_purchase_start_time && modalObj?.limit_purchase_end_time ? { "Start": moment(modalObj?.limit_purchase_start_time).format().replace('+08:00', ''), "End": moment(modalObj?.limit_purchase_end_time).format().replace('+08:00', '') } : ''
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
                title={
                    <span>
                        ③ Purchase condition of using vouchers (Purchased history)
                    </span>
                }
            />
            <Row gutter={[8, 8]}>
                <Col span={4} className="frank-end">
                    Lesson status
                    </Col>
                <Col span={6}>
                    <Select
                        options={translateOptions(lessonStatus)}
                        defaultValue={modalObj?.lesson_status ? modalObj.lesson_status : ''}
                        onChange={(value) => setModalObj({ ...modalObj, lesson_status: value })}
                        showSearch
                        optionFilterProp="label"
                        className="width-hundred-percent"
                    />
                </Col>
                <Col span={4} className="frank-end">
                    Package status
                    </Col>
                <Col span={8}>
                    <Select
                        options={translateOptions(packageStatus)}
                        defaultValue={modalObj?.package_status ? modalObj.package_status : ''}
                        onChange={(value) => setModalObj({ ...modalObj, package_status: value })}
                        showSearch
                        optionFilterProp="label"
                        className="width-hundred-percent"
                    />
                </Col>
                <Col span={4} className="frank-end">
                    Credits purchase
                    </Col>
                <Col span={3}>
                    <Select
                        options={translateOptions(creditsPurchase)}
                        defaultValue={modalObj?.selectCredit ? modalObj.selectCredit : ''}
                        onChange={(value) => {
                            if (value !== '0') {
                                creaditsPurchaseRef.current.state.value = value;
                            } else {
                                creaditsPurchaseRef.current.state.value = '';
                            }
                            setSelectCredit(value)
                        }}
                        showSearch
                        optionFilterProp="label"
                        className="width-hundred-percent"
                    />
                </Col>
                <Col span={3}>
                    <Input
                        ref={creaditsPurchaseRef}
                        disabled={selectCredit !== '0'}
                        defaultValue={modalObj?.credits_purchase
                            ? modalObj.credits_purchase
                            : ''} />
                </Col>
                <Col span={4} className="frank-end">
                    Other products
                    </Col>
                <Col span={8}>
                    <Select
                        options={translateOptions(otherProducts)}
                        defaultValue={modalObj?.other_products ? modalObj.other_products : ''}
                        onChange={(value) => setModalObj({ ...modalObj, other_products: value })}
                        showSearch
                        optionFilterProp="label"
                        className="width-hundred-percent"
                    />
                </Col>
                <Col span={4} className="frank-end">
                    Purchase time
                </Col>
                <Col span={6}>
                    <RangePicker
                        showTime={{
                            hideDisabledOptions: false,
                            defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                        }}
                        defaultValue={
                            modalObj?.purchase_start_time && modalObj?.purchase_end_time
                                ? [moment(modalObj?.purchase_start_time), moment(modalObj?.purchase_end_time)]
                                : []}
                        className="width-hundred-percent margin-top-5"
                        format='YYYY-MM-DD HH:mm'
                        ranges={{
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                            'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                            'This Year': [moment().startOf('year'), moment().endOf('year')],
                            'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
                        }}
                        onChange={(data, datastring) => setModalObj({ ...modalObj, purchase_start_time: datastring[0], purchase_end_time: datastring[1] })}
                    />
                </Col>

                <Col span={4} className="frank-end">
                    Not purchase time
                    </Col>
                <Col span={8}>
                    <RangePicker
                        showTime={{
                            hideDisabledOptions: false,
                            defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                        }}
                        defaultValue={modalObj?.limit_purchase_end_time && modalObj?.limit_purchase_start_time
                            ? [moment(modalObj?.limit_purchase_start_time), moment(modalObj?.limit_purchase_end_time)]
                            : []
                        }
                        className="width-hundred-percent margin-top-5"
                        format='YYYY-MM-DD HH:mm'
                        ranges={{
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                            'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                            'This Year': [moment().startOf('year'), moment().endOf('year')],
                            'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
                        }}
                        onChange={(data, datastring) => setModalObj({ ...modalObj, limit_purchase_start_time: datastring[0], limit_purchase_end_time: datastring[1] })}
                    />
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

export default PurchaseCondition;
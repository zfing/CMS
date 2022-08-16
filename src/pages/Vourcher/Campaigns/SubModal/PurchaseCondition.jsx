import React, { useState, useRef, useImperativeHandle } from 'react';
import { Modal, Button, Descriptions, Row, Col, Select, Input, DatePicker, Radio } from 'antd';
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction'
import DescriptionsItem from 'antd/lib/descriptions/Item';
import { lessonStatus, packageStatus, isAllAbove, otherProducts, creditsPurchase } from '../../CommonConst'
import moment from 'moment';

const { RangePicker } = DatePicker;

const PurchaseCondition = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [modalObj, setModalObj] = useState({});
    const [selectCredit, setSelectCredit] = useState();
    const [visible, setVisible] = useState(false);
    const creaditsPurchaseRef = useRef(null);

    const descriptionObj = {
        0: ['Lesson status', commonFilter(lessonStatus, resultObj.lesson_status, 'Unlimited')],
        1: ['Package status', commonFilter(packageStatus, resultObj.package_status, 'Unlimited')],
        2: ['Credits purchase', resultObj?.credits_purchase ? resultObj.credits_purchase : 'Unlimited'],
        3: ['Other products', commonFilter(otherProducts, resultObj.other_products, 'Unlimited')],
        4: ['Purchase Start time(UTC)', !!commonFilter('fDate', resultObj.purchase_start_time) ? commonFilter('fDate', resultObj.purchase_start_time) : 'Unlimited'],
        5: ['Purchase End time(UTC)', !!commonFilter('fDate', resultObj.purchase_end_time) ? commonFilter('fDate', resultObj.purchase_end_time) : 'Unlimited'],
        6: ['Not Purchase Start time(UTC)', !!commonFilter('fDate', resultObj.limit_purchase_start_time) ? commonFilter('fDate', resultObj.limit_purchase_start_time) : 'Unlimited'],
        7: ['Not Purchase End time(UTC)', !!commonFilter('fDate', resultObj.limit_purchase_end_time) ? commonFilter('fDate', resultObj.limit_purchase_end_time) : 'Unlimited'],
        8: ['Either of those above Or All above', commonFilter(isAllAbove, resultObj.isAllAbove, 'Unlimited')]
    }

    const openModal = () => {
        setVisible(true);
    }

    const confirm = () => {
        setResultObj({
            ...modalObj,
            selectCredit: selectCredit ? selectCredit : '',
            credits_purchase: creaditsPurchaseRef?.current?.state?.value ? creaditsPurchaseRef.current.state.value : '',
            isAllAbove: modalObj?.isAllAbove ? modalObj.isAllAbove : resultObj.isAllAbove ? resultObj.isAllAbove : '0'
        })
        setVisible(false);
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "AllAbove": resultObj.isAllAbove ? resultObj.isAllAbove : '0',
                    "BoughtUSD": resultObj?.credits_purchase ? resultObj.credits_purchase : '',
                    "BoughtITC": Number(resultObj?.credits_purchase ? resultObj.credits_purchase : 0) * 100,
                    "BoughtProduct": resultObj?.other_products ? Number(resultObj.other_products) : '',
                    "LessonStatus": resultObj?.lesson_status ? Number(resultObj.lesson_status) : '',
                    "PackageStatus": resultObj?.package_status ? Number(resultObj.package_status) : '',
                    "BoughtTimeRange": resultObj?.purchase_start_time && resultObj?.purchase_end_time ? { "Start": moment(resultObj?.purchase_start_time).format().replace('+08:00',''), "End": moment(resultObj?.purchase_end_time).format().replace('+08:00','')} : '',
                    "NotBoughtTimeRange": resultObj?.limit_purchase_start_time && resultObj?.limit_purchase_end_time ? { "Start": moment(resultObj?.limit_purchase_start_time).format().replace('+08:00',''), "End": moment(resultObj?.limit_purchase_end_time).format().replace('+08:00','')} : ''
                })
            }
            return temp;
        }
    }))

    return (
        <>
            <Descriptions
                column={2}
                title={
                    <span>
                        ③ Purchase condition of using vouchers (Purchased history)
                <Button type="link" onClick={openModal}>
                            Edit
                </Button>
                    </span>
                }
            >
                {
                    [...Array(9).keys()].map((item) => (
                        <DescriptionsItem key={`description_${item}`} label={descriptionObj[item][0]}>
                            {descriptionObj[item] ? descriptionObj[item][1] : 'Unlimited'}
                        </DescriptionsItem>
                    ))
                }
            </Descriptions>
            <Modal
                title={"Purchase condition of vouchers (Purchased history)"}
                onCancel={() => {
                    setVisible(false)
                    setSelectCredit()
                }}
                onOk={() => confirm()}
                visible={visible}
                destroyOnClose
                width={'620px'}
            >
                <Row gutter={[8, 8]}>
                    <Col span={8} className="frank-end">
                        Lesson status
                    </Col>
                    <Col span={16}>
                        <Select
                            options={translateOptions(lessonStatus)}
                            defaultValue={resultObj?.lesson_status ? resultObj.lesson_status : ''}
                            onChange={(value) => setModalObj({ ...modalObj, lesson_status: value })}
                            showSearch
                            optionFilterProp="label"
                            className="width-hundred-percent"
                        />
                    </Col>
                    <Col span={8} className="frank-end">
                        Package status
                    </Col>
                    <Col span={16}>
                        <Select
                            options={translateOptions(packageStatus)}
                            defaultValue={resultObj?.package_status ? resultObj.package_status : ''}
                            onChange={(value) => setModalObj({ ...modalObj, package_status: value })}
                            showSearch
                            optionFilterProp="label"
                            className="width-hundred-percent"
                        />
                    </Col>
                    <Col span={8} className="frank-end">
                        Credits purchase
                    </Col>
                    <Col span={8}>
                        <Select
                            options={translateOptions(creditsPurchase)}
                            defaultValue={resultObj?.selectCredit ? resultObj.selectCredit : ''}
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
                    <Col span={8}>
                        <Input
                            ref={creaditsPurchaseRef}
                            disabled={selectCredit !== '0'}
                            defaultValue={resultObj?.credits_purchase
                                ? resultObj.credits_purchase
                                : ''} />
                    </Col>
                    <Col span={8} className="frank-end">
                        Other products
                    </Col>
                    <Col span={16}>
                        <Select
                            options={translateOptions(otherProducts)}
                            defaultValue={resultObj?.other_products ? resultObj.other_products : ''}
                            onChange={(value) => setModalObj({ ...modalObj, other_products: value })}
                            showSearch
                            optionFilterProp="label"
                            className="width-hundred-percent"
                        />
                    </Col>
                    {
                        !!selectCredit && <>
                            <Col span={8} className="frank-end">
                                Purchase time
                            </Col>
                            <Col span={16}>
                                <RangePicker
                                    showTime={{
                                        hideDisabledOptions: false,
                                        defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                                    }}
                                    defaultValue={
                                        resultObj?.purchase_start_time && resultObj?.purchase_end_time
                                            ? [moment(resultObj?.purchase_start_time), moment(resultObj?.purchase_end_time)]
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
                        </>
                    }

                    <Col span={8} className="frank-end">
                        Not purchase time
                    </Col>
                    <Col span={16}>
                        <RangePicker
                            showTime={{
                                hideDisabledOptions: false,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                            }}
                            defaultValue={resultObj?.limit_purchase_end_time && resultObj?.limit_purchase_start_time
                                ? [moment(resultObj?.limit_purchase_start_time), moment(resultObj?.limit_purchase_end_time)]
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

export default PurchaseCondition;
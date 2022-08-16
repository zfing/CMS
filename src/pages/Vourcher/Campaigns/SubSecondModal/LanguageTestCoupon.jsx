import React, { useState, useImperativeHandle } from 'react';
import { Descriptions, Button, Modal, Row, Col, Select } from 'antd';
import { LanguageTestCouponType } from '../../CommonConst';
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';

const LanguageTestCoupon = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [modalObj, setModalObj] = useState({});

    const openModal = () => {
        setVisible(true);
    }

    const confirm = () => {
        setResultObj({
            ...modalObj
        });
        setVisible(false);
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "Type": resultObj?.type ? resultObj.type : '',
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
                        <span>⓪</span> Usetype of special voucher(Language Test Coupon)
                        <Button type="link" onClick={openModal}>Edit</Button>
                    </span>
                }>
                <Descriptions.Item label="Language Test Type">
                    <span>{commonFilter(LanguageTestCouponType, resultObj?.type, 'Unlimited')}</span>
                </Descriptions.Item>
            </Descriptions>
            <Modal
                visible={visible}
                title={'Usetype of special voucher'}
                onCancel={() => setVisible(false)}
                destroyOnClose
                onOk={confirm}
                width={'550px'}
            >
                <Row gutter={[8, 8]}>
                    <Col span={10} className="frank-start"> Language Test Type </Col>
                    <Col span={14}>
                        <Select
                            defaultValue={resultObj?.type ? resultObj?.type : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => setModalObj({ ...modalObj, type: value })}
                            showSearch
                            optionFilterProp="label"
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(LanguageTestCouponType)]}
                        >
                        </Select>
                    </Col>
                </Row>
            </Modal>
        </>
    )
})

export default LanguageTestCoupon;
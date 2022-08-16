import React, { useState, useRef, useImperativeHandle } from 'react';
import { Descriptions, Button, Modal, Row, Col, Select, Input } from 'antd';
import { userIdentity, voucherSource, countryObjs, languageObjs } from '../../CommonConst';
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction'

const UserCondition = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [modalObj, setModalObj] = useState({});
    const sourceRef = useRef(null);

    const openModal = () => {
        setVisible(true);
    }

    const confirm = () => {
        setResultObj({
            ...modalObj,
            code: modalObj?.source ? sourceRef?.current?.state?.value : ''
        });
        setVisible(false);
        props.getIdentity(modalObj?.identity)
    }
    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    'UserIdentity': Number(resultObj?.identity ? resultObj.identity : ''),
                    'RefSource': Number(resultObj?.source ? resultObj.source : ''),
                    'RefSourceCode':  resultObj?.code ? resultObj.code : '',
                    'FromCountry': resultObj?.from ? resultObj.from : '',
                    'NativeLanguage': resultObj?.native_language ? resultObj.native_language : '',
                    'LearnLanguage': resultObj?.learning ? resultObj.learning : '',
                    'TeachLanguage': resultObj?.teaching ? resultObj.teaching : ''
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
                        <span>①</span> User condition of using vouchers
                        <Button type="link" onClick={openModal}> Edit </Button>
                    </span>
                }>
                <Descriptions.Item label="User identity">
                    {commonFilter(userIdentity, resultObj?.identity, 'Unlimited')}
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                    <span>{commonFilter(voucherSource, resultObj?.source, 'Unlimited')}</span>
                    <span
                        className="padding-left-10">
                        Code:
                        {resultObj?.code}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item
                    label="From">
                    {commonFilter(countryObjs, resultObj?.from, 'Unlimited')}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Native Language">
                    {commonFilter(languageObjs, resultObj?.native_language, 'Unlimited')}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Learning">
                    {commonFilter(languageObjs, resultObj?.learning, 'Unlimited')}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Teaching">
                    {commonFilter(languageObjs, resultObj?.teaching, 'Unlimited')}
                </Descriptions.Item>
            </Descriptions>
            <Modal
                visible={visible}
                title={'User condition of vouchers'}
                onCancel={() => setVisible(false)}
                destroyOnClose
                onOk={confirm}
                width={'550px'}
            >
                <Row gutter={[8, 8]}>
                    <Col span={6} className="frank-end">
                        User identity
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.identity ? resultObj?.identity : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => {
                                setModalObj({...modalObj, identity: value})
                            }}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(userIdentity)]}
                        >
                        </Select>
                    </Col>
                    <Col span={6} className="frank-end">
                        Source
                    </Col>
                    <Col span={9}>
                        <Select
                            defaultValue={resultObj?.source ? resultObj?.source : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => { if (!value) { sourceRef.current.state.value = null }; setModalObj({ ...modalObj, source: value }) }}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(voucherSource)]}
                        >
                        </Select>
                    </Col>
                    <Col span={9}>
                        <Input ref={sourceRef} placeholder={'Code'} disabled={!modalObj.source} defaultValue={resultObj.code} />
                    </Col>
                    <Col span={6} className="frank-end">
                        From
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.from ? resultObj?.from : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => setModalObj({ ...modalObj, from: value })}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(countryObjs)]}
                        >
                        </Select>
                    </Col>
                    <Col span={6} className="frank-end">
                        Native Language
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.native_language ? resultObj?.native_language : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => setModalObj({ ...modalObj, native_language: value })}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                        >
                        </Select>
                    </Col>
                    <Col span={6} className="frank-end">
                        Learning
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.learning ? resultObj?.learning : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => setModalObj({ ...modalObj, learning: value })}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                        >
                        </Select>
                    </Col>
                    <Col span={6} className="frank-end">
                        Teaching
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.teaching ? resultObj?.teaching : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={(value) => setModalObj({ ...modalObj, teaching: value })}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                        >
                        </Select>
                    </Col>
                </Row>
            </Modal>
        </>
    )
})

export default UserCondition;
import React, { useState, useRef, useImperativeHandle } from 'react';
import { Descriptions, Row, Col, Select, Input } from 'antd';
import { userIdentity, voucherSource, countryObjs, languageObjs } from '../../CommonConst';
import { translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';

const UserCondition = React.forwardRef((props, ref) => {
    // const [modalObj, setResultObj] = useState({});
    const [modalObj, setModalObj] = useState({});
    const sourceRef = useRef(null);

    const handleUserIdentity = (value) => {
        setModalObj({ ...modalObj, identity: value })
        props.getIdentity(value)
    }
    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(modalObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "UserIdentity": Number(modalObj?.identity ? modalObj.identity : ''),
                    "RefSource": Number(modalObj?.source ? modalObj.source : ''),
                    "RefSourceCode": sourceRef.current.state.value ? sourceRef.current.state.value: '',
                    "FromCountry": modalObj?.from ? modalObj.from : '',
                    "NativeLanguage": modalObj?.native_language ? modalObj.native_language : '',
                    "LearnLanguage": modalObj?.learning ? modalObj.learning : '',
                    "TeachLanguage": modalObj?.teaching ? modalObj.teaching : ''
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
                        <span>①</span> User condition of using vouchers
                    </span>
                }
            />
            <Row gutter={[8, 8]}>
                <Col span={4} className="frank-end">
                    User identity
                </Col>
                <Col span={6}>
                    <Select
                        defaultValue={modalObj?.identity ? modalObj?.identity : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={v => handleUserIdentity(v)}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(userIdentity)]}
                    >
                    </Select>
                </Col>
                <Col span={4} className="frank-end">
                    Source
                </Col>
                <Col span={4}>
                    <Select
                        defaultValue={modalObj?.source ? modalObj?.source : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={(value) => { if (!value) { sourceRef.current.state.value = null }; setModalObj({ ...modalObj, source: value }) }}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(voucherSource)]}
                    >
                    </Select>
                </Col>
                <Col span={4}>
                    <Input 
                        ref={sourceRef}
                        placeholder={'Code'}
                        disabled={!modalObj.source}
                        defaultValue={modalObj.code}
                        onBlur={(e) => {
                            setModalObj({ ...modalObj, RefSourceCode: e?.target?.value })
                        }}
                    />
                </Col>
                <Col span={2}></Col>

                <Col span={4} className="frank-end">
                    From
                </Col>
                <Col span={6}>
                    <Select
                        defaultValue={modalObj?.from ? modalObj?.from : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={(value) => setModalObj({ ...modalObj, from: value })}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(countryObjs)]}
                    >
                    </Select>
                </Col>
                <Col span={4} className="frank-end">
                    Native Language
                </Col>
                <Col span={8}>
                    <Select
                        defaultValue={modalObj?.native_language ? modalObj?.native_language : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={(value) => setModalObj({ ...modalObj, native_language: value })}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                    >
                    </Select>
                </Col>
                <Col span={2}></Col>

                <Col span={4} className="frank-end">
                    Learning
                </Col>
                <Col span={6}>
                    <Select
                        defaultValue={modalObj?.learning ? modalObj?.learning : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={(value) => setModalObj({ ...modalObj, learning: value })}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                    >
                    </Select>
                </Col>
                <Col span={4} className="frank-end">
                    Teaching
                    </Col>
                <Col span={8}>
                    <Select
                        defaultValue={modalObj?.teaching ? modalObj?.teaching : ''}
                        className="width-hundred-percent"
                        placeholder={'Choose'}
                        onChange={(value) => setModalObj({ ...modalObj, teaching: value })}
                        options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                    >
                    </Select>
                </Col>
                <Col span={2}></Col>
            </Row>
        </>
    )
})

export default UserCondition;
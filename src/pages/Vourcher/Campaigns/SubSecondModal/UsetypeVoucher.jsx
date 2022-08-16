import React, { useState, useImperativeHandle } from 'react';
import { Descriptions, Button, Modal, Select, Tag, Form } from 'antd';
import { sessionTypes, languageObjs } from '../../CommonConst';
import { commonFilter, translateOptions, deleteEmptyProperty } from '../../../../components/CommonComponent/CommonFunction';

const UsetypeVoucher = React.forwardRef((props, ref) => {
    const [resultObj, setResultObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [codeForm] = Form.useForm();
    const openModal = () => {
        setVisible(true);
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let temp = {};
            if (Object.keys(resultObj).length !== 0) {
                temp = deleteEmptyProperty({
                    "SessionLanguage": resultObj?.sessionLanguage ? resultObj.sessionLanguage : '',
                    "SessionType": resultObj?.sessionType ? resultObj.sessionType.join() : '',
                })
            }
            return temp;
        }
    }))
    const getValueFromEvent = (values) => {
        if (values.some(val => val === '')) {
            return [''];
        }
        return values;
    };
    return (
        <>
            <Descriptions
                column={2}
                title={
                    <span>
                        <span>⓪</span> Usetype of special voucher(Lesson Coupon)
                        <Button type="link" onClick={openModal}>Edit</Button>
                    </span>
                }>
                <Descriptions.Item label="Lesson Language">
                    {commonFilter(languageObjs, resultObj?.sessionLanguage, 'Unlimited')}
                </Descriptions.Item>
                <Descriptions.Item label="Lesson Type">
                    {
                        !!resultObj?.sessionType
                            ? resultObj?.sessionType?.map((item, index) => <Tag className='margin-bottom-5' key={index}>
                                {sessionTypes[item] || 'Unlimited'}
                            </Tag>)
                            : <Tag>Unlimited</Tag>
                    }
                </Descriptions.Item>
                { 
                    props.view && 
                    <Descriptions.Item label="Max Lesson Price">
                    {props.value}
                </Descriptions.Item>
                }
            </Descriptions>
            <Modal
                visible={visible}
                title={'Usetype of special voucher'}
                onCancel={() => setVisible(false)}
                destroyOnClose
                onOk={() => codeForm.submit()}
                width={'550px'}
            >
                <Form
                    form={codeForm}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={(values) => {
                        setResultObj(values);
                        setVisible(false);
                    }}
                    initialValues={{
                        sessionLanguage: resultObj?.sessionLanguage ? resultObj?.sessionLanguage : '',
                        sessionType: resultObj?.sessionType ? resultObj?.sessionType : ''
                    }}
                >
                    <Form.Item
                        name='sessionLanguage'
                        label='Lesson Language'
                    >
                        <Select
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            optionFilterProp="label"
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                        />
                    </Form.Item>
                    <Form.Item
                        name='sessionType'
                        label='Lesson Type'
                        getValueFromEvent={e => getValueFromEvent(e)}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Choose"
                            showSearch
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(sessionTypes)]}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                </Form>
                {/* <Row gutter={[8, 8]}>
                    <Col span={6} className="frank-end">
                        Lesson Language
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={resultObj?.language ? resultObj?.language : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            optionFilterProp="label"
                            onChange={(value) => setModalObj({ ...modalObj, language: value })}
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(languageObjs)]}
                        >
                        </Select>
                    </Col>
                    <Col span={6} className="frank-end">
                        Lesson Type
                    </Col>
                    use_type：0 充值优惠券，1 课时优惠券，-1 所有（必选）
                    <Col span={18}>
                        <Select
                            defaultValue={modalObj?.type ? modalObj?.type : ''}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            onChange={value => {
                                setModalObj({ ...modalObj, type: value })
                            }}
                            showSearch
                            optionFilterProp="label"
                            options={[{ label: 'Unlimited', value: '' }, ...translateOptions(sessionTypes)]}
                        >
                        </Select>
                    </Col>
                </Row> */}
            </Modal>
        </>
    )
})

export default UsetypeVoucher;
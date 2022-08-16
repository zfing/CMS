import React, { useState, useImperativeHandle } from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { commonFilter } from '../../../../components/CommonComponent/CommonFunction';

interface ParentParams {
    onData: Function,
    curItem: any
}

const PayingOff = React.forwardRef((props: ParentParams, ref: any) => {
    const { onData, curItem } = props
    const [visible, setVisible] = useState<any>(false);
    const [itcValue, setItcValue] = useState<any>(0);
    const [titleKey, setTitleKey] = useState<any>({ key: '', title: '' });
    const [form] = Form.useForm()

    const cancel = () => {
        setVisible(false);
        setItcValue(0)
        form.resetFields()
    }
    useImperativeHandle(ref, () => ({
        open: (key: string, t: string) => {
            setVisible(true)
            setTitleKey({ key, title: t })
        },
        cancel: cancel
    }))
    const onFinish = (values: any) => {
        onData({ itc: Number(values.itc) * 100 }, curItem?.user_id)
    }
    return (
        <Modal
            title={titleKey?.title}
            visible={visible}
            destroyOnClose
            maskClosable={false}
            onCancel={cancel}
            footer={[
                <Button key="1" onClick={cancel}>
                  Cancle
                </Button>,
                <Button
                  key="2"
                  type="primary"
                  onClick={form.submit}
                  disabled={itcValue < 100 || itcValue > (titleKey?.key === '2' ? curItem?.negative_sv : curItem?.negative_tv)}
                >
                  Confirm
                </Button>,
              ]}
        >
            <div className='text-bold-7 margin-bottom-15'>
                Liabilities: {commonFilter('centToUsd', titleKey?.key === '2' ? curItem?.negative_sv : curItem?.negative_tv)} USD
            </div>
            <Form
                form={form}
                colon={false}
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ itc: "" }}
            >
                <Form.Item
                    name="itc"
                    label="Liabilities USD ($)"
                    rules={[{ required: true, message: "can't be empty" }]}
                >
                    <Input onChange={(e) => setItcValue(Number(e.target.value) * 100)} />
                </Form.Item>
            </Form>
        </Modal>
    )
})

export default PayingOff;
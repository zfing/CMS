import React, { useState, useImperativeHandle } from 'react';
import { Modal, Input, Button } from 'antd';

interface ParentParams {
    visible: boolean,
    submitLog: any,
    title: string,
    tooltip: string,
    isClose: boolean
}

const FrozenUserWallet = React.forwardRef((props: ParentParams, ref: any) => {
    const [visible, setVisible] = useState<any>(false);
    const [value, setValue] = useState<any>(null);
    const { title,tooltip } = props;
    const submit = () => {
        props.submitLog(value);
    }
    const cancel = () => {
        setVisible(false);
        setValue(null)
    }
    useImperativeHandle(ref, () => ({
        openLog: () => setVisible(true),
        cancel: () => cancel()
    }))
    return (
        <Modal
            title={title ? title : 'Log'}
            visible={visible}
            destroyOnClose
            onCancel={cancel}
            footer={[<Button key='1' onClick={cancel}>Cancel</Button>,
            <Button key='2' disabled={!value} type='primary' onClick={submit}>Confirm</Button>]}
        >
            <span>{tooltip ? tooltip : ''}</span>
            <Input onChange={(e) => setValue(e?.target?.value.trim())} className="margin-top-5" />
        </Modal>
    )
})

export default FrozenUserWallet;
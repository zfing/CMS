import React, { useRef, useState, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

interface ParentParams {
    visible: boolean,
    submitLog: any,
    title: string,
    tooltip: string,
    isClose: boolean
}

const CommonLog = React.forwardRef((props: ParentParams, ref: any) => {
    const [visible, setVisible] = useState<any>(false);
    const { title,tooltip } = props;
    const getLog: any = useRef(null);
    const submit = () => {
        let logValue = getLog.current.state.value ? getLog.current.state.value : ' ';
        props.submitLog(true, logValue);
        if(props.isClose && logValue === ' ') { //当log需要必填时却没值，就不关闭此公共弹框
            setVisible(true)
        } else {
            setVisible(false)
        }
    }
    const cancel = () => {
        setVisible(false);
    }
    useImperativeHandle(ref, () => ({
        openLog: () => {return setVisible(true);}
    }))
    return (
        <Modal
            title={title ? title : 'Log'}
            visible={visible}
            onOk={submit}
            destroyOnClose
            onCancel={cancel}
        >
            <span>{tooltip ? tooltip : 'Write Log:'}</span>
            <TextArea ref={getLog} rows={5} className="margin-top-5" />
        </Modal>
    )
})

export default CommonLog;
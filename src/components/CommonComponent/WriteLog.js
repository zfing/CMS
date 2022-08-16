import React, { PureComponent } from 'react';
import { Modal, Input } from 'antd';
export default class WriteLog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        }
    }
    onOk = () => {
        this.setState({ loading: true })
        this.props.onOk(this.refs.log.resizableTextArea.props.value);
    }
    onCancel = () => {
        this.setState({ visible: false, loading: false })
        this.props.onCancel && this.props.onCancel()
    }
    onShow = () => {
        this.setState({ visible: true })
    }
    render() {
        let { visible, loading } = this.state;
        const { title, tips } = this.props;
        return (
            <Modal maskClosable={false} width='600px' title={title ? title + '  Log  ' : 'Log'} visible={visible} onOk={this.onOk} onCancel={this.onCancel} destroyOnClose zIndex={1001} okText='Confirm' confirmLoading={loading}>
                {tips ? <p>{tips}</p> : null }
                <p>Write log</p>
                <Input.TextArea ref="log" rows={4} ></Input.TextArea>
            </Modal>
        )
    }

}
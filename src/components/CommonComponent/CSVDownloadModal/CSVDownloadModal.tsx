import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Col, Row, Tag, message, Spin } from 'antd';
import './CSVDownloadModal.css';
import qs from 'qs';
import Api from "../../Api";
interface DefaultCheckbox {
    postParam: string,
    title: string,
    defaultValue: number,
    span: number,
}
interface datas {
    label: string,
    value: string
}

interface ParentParams {
    visible: boolean,
    closeModalFunc: any
    defaultCheckbox: DefaultCheckbox[]
    defaultChecked: string[]
    selectObj: any
    downloadUrl: string,
    all: boolean,
    downloadName: string,
    title: string,
    dataArr: datas[]
}
const CSVDownloadModal = (props: ParentParams) => {
    const { title, visible, defaultCheckbox, defaultChecked, selectObj, downloadUrl, all, downloadName } = props;
    const [checkedArr, setCheckedArr] = useState(defaultChecked);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      visible && setCheckedArr(defaultChecked)
    }, [visible, defaultChecked])
    
    const closeModal = (type: number) => {
        if (type === 0) {
            props.closeModalFunc(false);
        } else {
            setLoading(true)
            let currentCheckedArr: DefaultCheckbox[] = defaultCheckbox.filter(item => checkedArr.indexOf(item.title) !== -1)
            let postAttr = Array.from(currentCheckedArr, item => item.postParam);
            let postParams = {
                ...selectObj,
                download_csv: 1,
                data_attr_s: postAttr,
                csv_header_s: checkedArr.filter((item: string) => item !== 'All'),
            }
            let finaParams = qs.stringify(postParams, { arrayFormat: 'repeat' });
            Api.get(`${downloadUrl}?${finaParams}`)
                .then((res) => {
                    let downLink = document.createElement('a');
                    downLink.download = `${downloadName || 'Download'}.csv`;
                    downLink.style.display = 'none';
                    //生成一个blob二进制数据，内容为返回数据
                    let blob = new Blob([JSON.parse(JSON.stringify(res.data))]);
                    //生成一个指向blob的URL地址，并赋值给a标签的href属性
                    downLink.href = URL.createObjectURL(blob);
                    document.body.appendChild(downLink);
                    downLink.click();
                    document.body.removeChild(downLink);
                })
                .catch((err) => {
                    message.warning(err?.response?.data?.error?.msg)
                })
                .finally(() => {
                    setLoading(false)
                    props.closeModalFunc(false);
                })
            // window.open(url);
        }
        // setCheckedArr(defaultChecked)
    }
    const changeCheckboxValue = (checkedValue: any) => {
        if (all) {
            let allSelect = defaultCheckbox.map(item => item.title)
            if (checkedValue.includes('All') && !checkedArr.includes('All')) {
                setCheckedArr(['All'].concat(allSelect))
                return
            }
            if (checkedArr.includes('All') && !checkedValue.includes('All')) {
                setCheckedArr([])
                return
            }
            if (allSelect.length === checkedValue.filter((item: string) => item !== 'All').length) {
                setCheckedArr(['All'].concat(allSelect))
                return
            }
            if (allSelect.length !== checkedValue.filter((item: string) => item !== 'All').length) {
                setCheckedArr(checkedValue.filter((item: string) => item !== 'All'))
                return
            }
        } else {
            setCheckedArr(checkedValue)
        }
    }
    const deletePostParam = (item: string) => {
        const arr = checkedArr.filter((selElement: string) => (item !== selElement && selElement !== 'All'))
        setCheckedArr(arr)
    }

    return (
        <Modal
            visible={visible}
            onCancel={() => closeModal(0)}
            onOk={() => closeModal(1)}
            title={title ? title : 'CSV Download'}
            destroyOnClose
            okButtonProps={{ disabled: checkedArr.length === 0 }}
            okText='Download'
        >
            <Spin spinning={loading}>
                <Checkbox.Group
                    onChange={changeCheckboxValue}
                    defaultValue={defaultChecked}
                    value={checkedArr}>
                    <Row>
                        {all && <Col span={24}>
                            <Checkbox value='All' className='text-bold-7'>
                                All
                            </Checkbox>
                        </Col>}
                        {
                            defaultCheckbox.map(item => (
                                <Col span={item.span || 24} key={item.title}>
                                    <Checkbox value={item.title} className='text-bold-7'>
                                        {item.title}
                                    </Checkbox>
                                </Col>
                            ))
                        }
                        <Col span={24} className="margin-top-20">
                            <hr />
                        </Col>
                        <Col span={24} className="margin-top-20">
                            {checkedArr.filter((item: string, index: number) => item !== 'All').map(item => <Tag key={item} style={{ marginBottom: 5 }} onClose={() => deletePostParam(item)} closable={true} >{item}</Tag>)}
                        </Col>
                    </Row>
                    <Row justify='end' style={{ color: '#df5138', marginTop: 20 }}>Every time can only download 10 thousand data</Row>
                </Checkbox.Group>
            </Spin>
        </Modal >
    )
}

export default CSVDownloadModal;
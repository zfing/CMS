import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Col, Select, Input } from 'antd';
const SearchByPhoneNumber = (props, ref) => {
    const { selObj } = props;
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('');
    const input = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                if (input.current && input.current.state.value) {
                    return {
                        [selObj.postParam]: `+${code},${input.current.state.value}`
                    }
                }
                return {}
            }
        }
    })

    return (
        <Col className="gutter-row" span={8}>
            <div className="padding-5-10">
                <label className="default-font-color">{selObj.title}</label>
                <Select
                    showSearch
                    defaultValue={selObj.defaultValue ? selObj.defaultValue : ''}
                    className="width-hundred-percent padding-top-5"
                    onChange={(v) => {
                        setCode(v)
                        if (v !== '') {
                            setShow(true)
                        } else {
                            setShow(false)
                        }
                    }}
                >
                    {
                        !selObj.noDefaultOption && <Select.Option value=''>All</Select.Option>
                    }
                    {
                        selObj.optionsArr && selObj.optionsArr.map((selOption) => (
                            <Select.Option key={selOption.t} value={selOption.v}>{selOption.t}</Select.Option>
                        ))
                    }
                </Select>
                {show && <Input className='margin-top-5' ref={input} />}
            </div>
        </Col>
    );

}

export default forwardRef(SearchByPhoneNumber);
import React, { useImperativeHandle, useState, useRef } from 'react';
import { Select } from 'antd';
import './MetaDatepickerWithSelect.css'
import RangePicker from './RangePicker';

const { Option } = Select;

const MetaRangeInput = React.forwardRef((props, ref) => {
    const { selObj } = props;
    const [currentOption, setCurrentOption] = useState(selObj.defaultOption ? selObj.defaultOption : 0);
    const rangePicker = useRef(null);
    useImperativeHandle(ref, () => ({
        getValue: () => {
            let result = [{
                [selObj.postParam[currentOption * 2]]: rangePicker?.current?.getValue()[0],
                [selObj.postParam[currentOption * 2 + 1]]: rangePicker?.current?.getValue()[1]
            }, selObj.postParam.filter(item => item !== selObj.postParam[currentOption * 2] && item !== selObj.postParam[currentOption * 2 + 1])]
            return result;
        }
    }))
    const getRangeValue = (e) => {
        setCurrentOption(e);
    }
    return (
        <div className="padding-5-10" key={selObj.title}>
            <label className="default-font-color">{selObj.title}</label>
            <div className="margin-top-5 display-flex">
                <Select
                    defaultValue={selObj?.defaultOption}
                    onChange={(e) => getRangeValue(e)}
                // className="max-width-100"
                >
                    {selObj.optionsArr.map((item) => (
                        <Option key={`${item.v}`} value={item.v}>{item.t}</Option>
                    ))}
                </Select>
                <RangePicker selObj={selObj} ref={rangePicker} />
            </div>
        </div >
    )
})
export default MetaRangeInput;

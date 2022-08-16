import React, { useImperativeHandle, useRef, useState } from 'react';
import { Select, Input } from 'antd';
import './MetaRangeInput.css'
import { commonFilter } from '../../CommonFunction';
const { Option } = Select;

interface SelObj {
    title: string,
    maxPostParam?: any,
    minPostParam?: any,
    except: Boolean,
    toCent: Boolean
}
interface ParentParams {
    selObj: SelObj,
    keyName: string
}

const MetaRangeInput = React.forwardRef((props: ParentParams, ref) => {
    const { selObj, keyName } = props;
    const getRangeMinSearch = useRef<any>(null);
    const getRangeMaxSearch = useRef<any>(null);
    const [range, setRange] = useState('1');

    useImperativeHandle(ref, () => ({
        getValue: () => {
            let max: string = '';
            let min: string = '';
            let result = {};
            if (getRangeMaxSearch.current || getRangeMinSearch.current) {
                let tempMax = getRangeMaxSearch.current.state.value;
                let tempMin = getRangeMinSearch.current.state.value;
                if (selObj?.toCent) {
                    tempMax = commonFilter('usdToCent',tempMax);
                    tempMin = commonFilter('usdToCent',tempMin);
                }
                if (range === '1') {
                    max = tempMax || null;
                    min = tempMin || null;
                } else {
                    max = tempMin || null;
                    min = tempMax || null;
                }
            }
            if (max || min) {
                result = { [selObj.maxPostParam]: max, [selObj.minPostParam]: min };
            }
            return result;
        }
    }))
    const getRangeValue = (e: string) => {
        setRange(e);
    }
    return (
        <div className="padding-5-10">
            <label className="default-font-color">{selObj.title}</label>
            <div className="margin-top-5 display-flex">
                <Select defaultValue="1" onChange={getRangeValue} className="flex-4" disabled>
                    <Option value="1">Between</Option>
                    {selObj.except === true ? "" : <Option value="2" >Except</Option>}
                </Select>
                <Input
                    className="flex-3 text-align-center"
                    key={`${selObj.title}_min_value${keyName}`}
                    ref={getRangeMinSearch}
                    placeholder="Minimum" />
                <Input
                    style={{
                        width: 30,
                        borderLeft: 0,
                        borderRight: 0,
                        pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                />
                <Input
                    ref={getRangeMaxSearch}
                    className="text-align-center flex-3 width-100"
                    placeholder="Maximum"
                    key={`${selObj.title}_max_value${keyName}`}
                />
            </div>
        </div>
    )
})
export default MetaRangeInput;

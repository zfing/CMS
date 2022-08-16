import React, { useImperativeHandle, useRef } from 'react';
import { Input } from 'antd';

interface SelObj {
    title: string,
    placeholder: string,
    postParam: string,
    defaultValue?: string,
}
interface ParentParams {
    selObj: SelObj
    deleteParam: Function
}
interface stringParams {
    [string: string]: string
}
const MetaInput = React.forwardRef((props:ParentParams, ref) => {
    const { selObj } = props;
    const getInputValue:any = useRef();
    useImperativeHandle(ref, () => ({
        getValue: () => {
            let result:stringParams;
            result = getInputValue.current && getInputValue.current.state.value ? {[selObj.postParam]: getInputValue.current.state.value} : {};
            if (selObj.defaultValue && getInputValue.current && (getInputValue.current.state.value === '' || getInputValue.current.state.value === null)) {
                
                props.deleteParam(selObj.postParam);
            }
            Object.keys(result).map(attr=>result[attr]=result[attr].trim())
            return result;
        }
    }))
    return (
        <div className="padding-5-10">
            <label className="default-font-color">{selObj.title}</label><br />
            <Input ref={getInputValue} placeholder={selObj.placeholder} className="width-hundred-percent margin-top-5" key={selObj.title} defaultValue = {selObj.defaultValue} />
        </div>
    )
})
export default MetaInput;
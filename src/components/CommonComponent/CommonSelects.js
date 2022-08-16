import React, { useState, useCallback, useRef, useEffect, useImperativeHandle } from 'react';
import { Col, Row, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import MetaRangeInput from './MetaComponent/MetaRangeInput/MetaRangeInput.tsx';
import MetaInput from './MetaComponent/MetaInput/MetaInput.tsx';
import MetaDatepickerWithSelect from './MetaComponent/MetaDatepickerWithSelect/MetaDatepickerWithSelect';
import PhoneNumber from './PhoneNumber'
const { Option } = Select;
const { RangePicker } = DatePicker;

const CommonSelects = React.forwardRef((props, ref) => {
    const { allSearch, defaultSearchData } = props;
    const [searchData, setSearchData] = useState(defaultSearchData ? defaultSearchData : {});
    const searchByInputArr = useRef([]);
    const searchByMetaRangeInputArr = useRef([]);
    const searchByMetaDatepickerWithSelectArr = useRef([]);
    const searchByPhoneNumber = useRef(null)
    const omit = (currentObj, deleteProperty) => {
        let result = {};
        if (Object.keys(currentObj).length > 0) {
            result = Object.keys(currentObj).reduce((acc, currentValue) => {
                return deleteProperty.includes(currentValue)
                    ? acc
                    : { ...acc, [currentValue]: currentObj[currentValue] }
            }, '')
        }
        return result;
    }
    const getAllValue = () => {
        let giveParentsData = {};
        giveParentsData = searchData;
        if (searchByMetaRangeInputArr.current) {
            for (let i = 0; i < searchByMetaRangeInputArr.current.length; i++) {
                giveParentsData = {
                    ...giveParentsData,
                    ...searchByMetaRangeInputArr.current[i].getValue()
                }
            }
        }
        
        if (searchByPhoneNumber.current) {
            giveParentsData = {
                ...giveParentsData,
                ...searchByPhoneNumber.current.getValue()
            }
        }
        if (searchByInputArr.current) {
            for (let i = 0; i < searchByInputArr.current.length; i++) {
                giveParentsData = {
                    ...giveParentsData,
                    ...searchByInputArr.current[i].getValue()
                }
            }
        }
        if (searchByMetaDatepickerWithSelectArr.current) {
            for (let i = 0; i < searchByMetaDatepickerWithSelectArr.current.length; i++) {
                let tempResult = searchByMetaDatepickerWithSelectArr.current[i]?.getValue();
                let nextResult = omit(giveParentsData, tempResult[1]);
                giveParentsData = {
                    ...tempResult[0],
                    ...nextResult
                }
            }
        }
        return giveParentsData;
    }
    const search = () => {
        let giveParentsData = getAllValue();
        props.search(giveParentsData)
    }
    const searchBySelect = useCallback(node => {
        if (node !== null) {
            // console.log('node', node)
        }
    }, [])
    const getSelectValue = (selObj, callBack, data) => {
        let temp = {};
        temp = searchData;
        if (data === undefined || data === '') {
            delete temp[selObj.postParam];
        } else {
            temp[selObj.postParam] = data;
        }
        setSearchData(temp)
        if (selObj.hasOwnProperty('related')) {
            props.update(data);
        }
        typeof callBack === 'function' && callBack(data)
    }
    const getDatePickerValue = (selObj, data, datastring) => {
        setSearchData((searchData) => {
            searchData[selObj.minPostParam] = datastring[0];
            searchData[selObj.maxPostParam] = datastring[1];
            return searchData;
        })
    }
    const searchByMetaRangeInput = (dom) => {
        dom && searchByMetaRangeInputArr.current.push(dom);
    }
    const searchByInput = (dom) => {
        dom && searchByInputArr.current.push(dom);
    }
    const searchByMetaDatepickerWithSelect = (dom) => {
        dom && searchByMetaDatepickerWithSelectArr.current.push(dom);
    }
    useEffect(() => {
        searchByMetaDatepickerWithSelect();
        searchByMetaRangeInput();
        searchByInput();
    }, [])
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return getAllValue();
        },
        updateSearchData: (value) => {
            setSearchData({ ...searchData, ...value })
        }
    }))
   
    return (
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 0]} className="margin-0">
            {allSearch.map((selObj, key) => {
                switch (selObj.type) {
                    case 'searchBySelect':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <div className="padding-5-10">
                                    <label className="default-font-color">{selObj.title}</label>
                                    <Select
                                        ref={searchBySelect}
                                        showSearch
                                        virtual={!selObj.virtual}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        defaultValue={selObj.defaultValue ? selObj.defaultValue : ''}
                                        className="width-hundred-percent padding-top-5"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={getSelectValue.bind(this, selObj, selObj?.callBack)}
                                    >
                                        {
                                            !selObj.noDefaultOption && <Option value=''>{selObj.defaultText ? selObj.defaultText : 'All'}</Option>
                                        }
                                        {
                                            selObj.optionsArr && selObj.optionsArr.map((selOption,index) => (
                                                <Option 
                                                    key={selObj.useV ? selOption.v : selOption.t || index} 
                                                    value={selOption.v}>
                                                    {selObj.useV ? selOption.v : selOption.t}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col>
                        );
                    case 'searchBySelectMode':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <div className="padding-5-10">
                                    <label>{selObj.title}</label>
                                    <Select
                                        ref={searchBySelect}
                                        placeholder='Choose'
                                        className="width-hundred-percent padding-top-5"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={getSelectValue.bind(this, selObj,selObj?.callBack)}
                                        mode={selObj.mode}
                                        defaultValue={selObj.defaultValue !== undefined ? selObj.defaultValue : []}
                                        disabled={selObj.optionsArr.length < 1 ? true : false}
                                    >
                                        {
                                            selObj.optionsArr && selObj.optionsArr.map((selOption) => (
                                                <Option key={selOption.t} value={selOption.v}>{selOption.t}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col>
                        );
                    case 'searchByAdmin':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <div className="padding-5-10">
                                    <label className="default-font-color">{selObj.title}</label>
                                    <Select
                                        defaultValue=""
                                        className="width-hundred-percent padding-top-5"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={getSelectValue.bind(this, selObj.title)}
                                    >
                                        <Option value=''>All</Option>
                                        {
                                            selObj.optionsArr && selObj.optionsArr.map((selOption) => (
                                                <Option key={selOption.id} value={selOption.username}>{selOption.username}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col>
                        )
                    case 'searchByInput':
                        return (
                            <Col
                                className="gutter-row"
                                span={8}
                                key={key}
                            >
                                <MetaInput selObj={selObj} ref={(dom) => searchByInput(dom)} deleteParam={(param) => { let temp = searchData; delete temp[param]; setSearchData(temp); }} />
                            </Col>
                        )
                    case 'searchByDatepicker':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <div className="padding-5-10">
                                    <label className="default-font-color">{selObj.title}</label>
                                    <RangePicker
                                        defaultValue={[selObj.defaultStartTime, selObj.defaultEndTime]}
                                        className="width-hundred-percent" style={{ 'marginTop': '5px' }}
                                        ranges={{
                                            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                                            'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                                            'This Year': [moment().startOf('year'), moment().endOf('year')],
                                            'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
                                        }}
                                        onChange={getDatePickerValue.bind(this, selObj)}
                                    />
                                </div>
                            </Col>
                        );
                    case 'searchByDatepickerWithSelect':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <MetaDatepickerWithSelect selObj={selObj} ref={(dom) => searchByMetaDatepickerWithSelect(dom)} />
                            </Col>
                        )
                    case 'searchByRange':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                <MetaRangeInput keyName={key} ref={(dom) => searchByMetaRangeInput(dom)} selObj={selObj} />
                            </Col>
                        );
                    case 'searchByPhoneNumber':
                        return <PhoneNumber selObj={selObj} key={key} ref={searchByPhoneNumber} />
                    case 'expand':
                        return (
                            <Col className="gutter-row" span={8} key={key}>
                                {selObj.expand}
                            </Col>
                        );
                    default:
                        console.log('Please add type prop')
                        break;
                }
                return '';
            })}
            <Col span={allSearch.length % 3 === 0 ? 24 : allSearch.length % 3 === 1 ? 16 : 8}>
                <div className="search-button margin-15-0 text-align-right" style={{ marginTop: 35, marginRight: 20 }}>
                    <Button type="primary" className="background-color-blue white" onClick={() => search()}>Search</Button>
                </div>
            </Col>
        </Row>
    )
})
export default CommonSelects;
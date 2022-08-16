import React, { useImperativeHandle, useState, useRef } from 'react';
import { Modal, Spin, Row, Col, Select, Tooltip, Input, DatePicker, notification } from 'antd';
import {
    allShowType,
    regional,
    amount,
    usage,
    eachAmount,
    categoryType,
    conditionType,
    lessonCouponTypes,
    currentUserTeamId,
    purchaseCouponTypes,
    languageTestCouponTypes
} from '../../CommonConst';
import {
    vtObj, commonFilter, translateOptions, deteleStrSpace, deleteEmptyObj
} from '../../../../components/CommonComponent/CommonFunction'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment';
import UserCondition from '../SubModal/UserCondition';
import TimeCondition from '../SubModal/TimeCondition';
import PurchaseCondition from '../SubModal/PurchaseCondition';
import CommonLog from '../../../../components/CommonComponent/CommonLog';
import ValidateCondition from './ValidateCondition';
import oldApi from '../../../../components/Api';
import UsetypeVoucher from './UsetypeVoucher';
import LanguageTestCoupon from "./LanguageTestCoupon";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateCoupon = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [campaignCodeValue, setcampaignCodeValue] = useState('');
    const [buyValue, setBuyValue] = useState('');
    const [maxFreeITC, setMaxFreeITC] = useState('');
    const [MLPVisible, setMLPVisible] = useState(false);
    const [resultObj, setResultObj] = useState({
        show_type: '',
        regional: '1',
        condition: '3',
        usage_limit: '1',
        specify_coupon: '0',
        start_time: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        end_time: moment().startOf('day').add(1, 'years').format('YYYY-MM-DD HH:mm')
    });
    const [useObj, setUseObj] = useState({ UseType: '0', CanUseBalance: 0 });
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [voucherAmount, setVoucherAmount] = useState('');
    const [onceAmount, setOnceAmount] = useState('');
    const generationRef = useRef(null);
    const eachGenerationRef = useRef(null);
    const userConditionRef = useRef(null);
    const timeConditionRef = useRef(null);
    const purchaseConditionRef = useRef(null);
    const campaignCodeRef = useRef(null);
    const campaignDescRef = useRef(null);
    const commonLogRef = useRef(null);
    const usetypeVoucherRef = useRef(null);
    const languageTestCouponRef = useRef(null);
    const validateConditionRef = useRef(null);
    const buyRef = useRef(null);
    const getRef = useRef(null);
    const maxFreeITCRef = useRef(null);
    const [identity, setIdentity] = useState('')

    useImperativeHandle(ref, () => ({
        open: (title) => {
            setTitle(title);
            setVisible(true);
        }
    }))
    // limit
    // $scope.CheckData = function () {
    //     if ($scope.processing)return false;
    //     if (!formObj.show_type || !formObj.category_code || !formObj.remark || !(/^[A-Za-z0-9]+$/.test(formObj.category_code)))
    //       return false;
    //     if ((parseFloat(formObj.voucherValueUsd) || 0) < 1) return false;
    //     if (formObj.condition != '1') {
    //       if ((parseFloat(formObj.UseLimitUSD) || 0) <= 0)return false;
    //     }
    //     if ($scope.loginDuration == '0') {
    //       if ((parseInt($scope.condition.TimeCondition.LoginDays) || 0) < 1)return false;
    //     }
    //     if (formObj.voucher_amount != -1 && (parseInt(formObj.voucher_amount) || 0) < 1)return false;
    //     if ((parseInt(formObj.voucher_once_count) || 0) < 1)return false;
    //     if (!formObj.specify_coupon) {
    //       $scope.showSpecifyUserCount = false;
    //     } else {
    //       if (old_specify_condition_json != getPostData()['specify_condition_json'])
    //         $scope.showSpecifyUserCount = false;
    //     }
    //     return true;
    //   }

    const confirm = () => {
        if (
            resultObj.show_type
            && campaignCodeRef?.current?.state?.value
            && resultObj.specify_coupon
            && useObj.UseType
            // && buyRef?.current?.state?.value
            // && getRef?.current?.state?.value
            && resultObj.regional
            && generationRef?.current?.state?.value
            && campaignDescRef?.current?.state?.value
            && eachGenerationRef?.current?.state?.value
        ) { 
            if(resultObj?.condition === '4'){
                !!maxFreeITCRef?.current?.state?.value
                ? commonLogRef.current.openLog()
                : notification.info({
                    message: 'Tips',
                    description: 'Please enter required fields.'
                })
            } else if(buyRef?.current?.state?.value && getRef?.current?.state?.value) {
                commonLogRef.current.openLog()
            } else notification.info({
                message: 'Tips',
                description: 'Please enter required fields.'
            })
        } else {
            notification.info({
                message: 'Tips',
                description: 'Please enter required fields.'
            })
        }
    }
    const submitLog = (submit, value) => {
        setLoading(true);
        setModalLoading(true);
        for(let v in resultObj) {
            if(v==='condition' && resultObj[v] === '4' ) {
                resultObj[v] = '3' 
            }
        }
        let postData = {
            ...resultObj,
            voucher_amount: generationRef?.current?.state?.value,
            voucher_once_count: eachGenerationRef?.current?.state?.value,
            category_code: deteleStrSpace(campaignCodeRef?.current?.state?.value),
            remark: campaignDescRef?.current?.state?.value,
            UseLimitUSD: buyRef?.current?.state?.value,
            voucherValueUsd: getRef?.current?.state?.value,
            voucher_value: getRef?.current?.state?.value
                 ? commonFilter('usdToCent', getRef?.current?.state?.value) 
                 : commonFilter('usdToCent',maxFreeITCRef?.current?.state?.value),
            condition_json: JSON.stringify({
                SessionCondition: {
                    ...usetypeVoucherRef?.current?.getValue(), 
                    UseLimitMaxITC: maxFreeITCRef?.current?.state?.value && commonFilter('usdToCent',maxFreeITCRef?.current?.state?.value)
                },
                ProductCondition: languageTestCouponRef?.current?.getValue(),
                UserCondition: userConditionRef?.current?.getValue(),
                TimeCondition: timeConditionRef?.current?.getValue(),
                PurchaseCondition: identity !== '1' ? purchaseConditionRef?.current?.getValue() : {},
                ValidDateCondition: validateConditionRef?.current.getValue(),
                UseLimitUSD: Number(buyRef?.current?.state?.value),
                UseLimitITC: commonFilter('usdToCent', buyRef?.current?.state?.value),
                UseType: Number(useObj?.UseType),
                CanUseBalance: Number(useObj?.CanUseBalance) || 0
            }),
            operate: 'create_campaign',
            log_note: value
        }
        if (useObj.UseType === '1') {
            JSON.parse(postData['condition_json'])['SessionCondition'] = usetypeVoucherRef?.current?.getValue();
        }
        if (useObj.UseType === '3') {
            JSON.parse(postData['condition_json'])['ProductCondition'] = languageTestCouponRef?.current?.getValue();
        }
        const POSTDATA = {
            ...deleteEmptyObj(postData),
            condition_json: JSON.stringify(deleteEmptyObj(JSON.parse(postData['condition_json'])))
        }
        oldApi.post('voucher/campaign/create', POSTDATA).then(
            res => {
                notification.info({
                    message: 'Success'
                })
                setVisible(false);
                setResultObj({ ...resultObj, usage_limit: '1' })
                setUseObj({ ...useObj, CanUseBalance: 0 })
                props.onOk()
            }
        ).catch(
            err => {
                notification.error({
                    message: 'Error',
                    description: err?.response?.data?.error?.msg
                })
            }
        ).finally(
            () => {
                setModalLoading(false);
                setLoading(false);
            }
        )
        setIdentity('')
    }
    return (
        <Modal
            visible={visible}
            title={title}
            onCancel={() => {
                setVisible(false)
                setVoucherAmount('')
                setOnceAmount('')
                setIdentity('')
                setResultObj({ ...resultObj, usage_limit: '1' })
                setUseObj({ ...useObj, CanUseBalance: 0 })
            }}
            confirmLoading={loading}
            destroyOnClose
            width={'85vw'}
            onOk={confirm}
        >
            <Spin spinning={modalLoading}>
                <Row gutter={[8, 8]} className="basic-information">
                    <Col span={4} className="frank-end">
                        Use Type*
                    </Col>
                    <Col span={7}>
                        <Select
                            value={useObj?.UseType}
                            className="width-hundred-percent"
                            placeholder="Choose"
                            showSearch
                            options={
                                [
                                    { 'label': 'Purchase Coupon', 'value': '0' },
                                    { 'label': 'Lesson Coupon', 'value': '1' },
                                    { 'label': 'Language Test Coupon', 'value': '3' }
                                ]
                            }
                            onChange={(value) => {
                                setResultObj({ ...resultObj, show_type: '' });
                                setUseObj({ ...useObj, UseType: value })
                                value !== '0' && setResultObj({ ...resultObj, condition: '3', show_type: '' })
                                setBuyValue(null)
                            }}
                            optionFilterProp="label"
                        />
                    </Col>
                    <Col span={5} className="frank-end">
                        Regional*
                    </Col>
                    <Col span={7}>
                        <Select
                            className="width-hundred-percent"
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder={'Choose'}
                            onChange={(value) => setResultObj({ ...resultObj, regional: value })}
                        >
                            {vtObj(regional).map((item) => {
                                return <Option value={item.v} key={item.v}>
                                    {item.t}
                                </Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={1}></Col>
                    {/* second */}
                    <Col span={4} className="frank-end">
                        Transaction Type*
                    </Col>
                    <Col span={7}>
                        <Select
                            value={resultObj.show_type || undefined}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            options={
                                useObj.UseType === '1'
                                    ? translateOptions(allShowType).filter(item =>
                                    (lessonCouponTypes.includes(item.value)
                                        &&
                                        (currentUserTeamId === 1 || item.value.substr(0, 3) === currentUserTeamId.toString())
                                    )
                                    )
                                    : useObj.UseType === '3'
                                        ? translateOptions(allShowType).filter(item =>
                                            languageTestCouponTypes.includes(item.value)
                                            &&
                                            (currentUserTeamId === 1 || item.value.substr(0, 3) === currentUserTeamId.toString())
                                        )
                                        : translateOptions(allShowType).filter(item =>
                                        (purchaseCouponTypes.includes(item.value)
                                            &&
                                            (currentUserTeamId === 1 || item.value.substr(0, 3) === currentUserTeamId.toString()))
                                        )
                            }
                            optionFilterProp="label"
                            onChange={(value) => setResultObj({ ...resultObj, show_type: value })}
                        />
                    </Col>
                    <Col span={5} className="frank-end">
                        Category Type*
                    </Col>
                    <Col span={7}>
                        <Select
                            className="width-hundred-percent"
                            placeholder="Choose"
                            showSearch
                            options={
                                translateOptions(categoryType).filter(item => ['0', '3'].includes(item.value))
                            }
                            optionFilterProp="label"
                            onChange={(value) => {
                                setResultObj({ ...resultObj, specify_coupon: value })
                            }}
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={4} className="frank-end">
                        <Tooltip placement={'bottom'} title="Total maximum amount allowed to generate vouchers">
                            Generation# for total <QuestionCircleOutlined />*
                        </Tooltip>
                    </Col>
                    <Col span={4}>
                        <Select
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value) => {
                                if (value === "0") {
                                    generationRef.current.state.value = '';
                                } else {
                                    generationRef.current.state.value = value;
                                }
                                setVoucherAmount(value);
                            }}
                        >
                            <Option value={"-1"}>Unlimited</Option>
                            {vtObj(amount).map((item) => {
                                return <Option value={item.v} key={item.v}>
                                    {item.t}
                                </Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Input
                            onInput={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value < 1 ? 1 : e.target.value
                                    }
                                }}
                            onKeyUp={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value.replace(/[^0-9.]+/g, '')
                                    }
                                }
                            }
                            ref={generationRef}
                            disabled={voucherAmount !== '0' || voucherAmount === ''} />
                    </Col>
                    <Col span={5} className="frank-end">
                        <Tooltip placement={'bottom'} title="Maximum amount per time allowed to generate vouchers">
                            Each generation# for total <QuestionCircleOutlined />*
                        </Tooltip>
                    </Col>
                    <Col span={4}>
                        <Select
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value) => {
                                if (value === "0") {
                                    eachGenerationRef.current.state.value = '';
                                } else {
                                    eachGenerationRef.current.state.value = value;
                                }
                                setOnceAmount(value);
                            }}
                        >
                            {vtObj(eachAmount).map((item) => {
                                return <Option value={item.v} key={item.v}>
                                    {item.t}
                                </Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Input
                            ref={eachGenerationRef}
                            disabled={onceAmount !== '0'}
                            onInput={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value < 1 ? 1 : e.target.value
                                    }
                                }}
                            onKeyUp={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value.replace(/[^0-9.]+/g, '')
                                    }
                                }
                            }
                        />
                    </Col>
                    <Col span={1}>

                    </Col>
                    <Col span={4} className="frank-end">
                        Campaign Code*
                    </Col>
                    <Col span={19}>
                        <Input
                            ref={campaignCodeRef}
                            onChange={(e) => {
                                if (e?.target?.value) {
                                    setcampaignCodeValue(deteleStrSpace(e.target.value.replace(/[^0-9a-zA-Z]+$/, '')))
                                    // e.target.value = e.target.value.replace(/[^0-9a-zA-Z]+$/, '')
                                } else {
                                    setcampaignCodeValue(null)
                                }
                            }
                            }
                            value={campaignCodeValue}
                            // onKeyUp={
                            //     (e) => {
                            //         if (e?.target?.value) {
                            //             e.target.value = e.target.value.replace(/[^0-9a-zA-Z]+/g, '')
                            //         }
                            //     }
                            // }
                            placeholder="Campaign Code must be characters ('A-Z','a-z','0-9')"
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={4} className="frank-end-vertical-start">
                        Campaign Desc*
                    </Col>
                    <Col span={19}>
                        <TextArea
                            ref={campaignDescRef}
                            rows="4" />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={4} className="frank-end">
                        Condition Type
                    </Col>
                    <Col span={7}>
                        <Select
                            defaultValue={resultObj?.condition}
                            value={['1', '3'].includes(useObj?.UseType)
                                ? useObj?.UseType === '1'
                                    ? resultObj?.condition
                                    : '3'
                                : resultObj?.condition === '4'
                                    ? '3'
                                    : resultObj?.condition}
                            className="width-hundred-percent"
                            placeholder="Choose"
                            showSearch
                            options={['1', '3'].includes(useObj?.UseType)
                                ? useObj?.UseType === '1'
                                    ? translateOptions(conditionType).filter(item => ['3', '4'].includes(item.value))
                                    : translateOptions(conditionType).filter(item => ['3'].includes(item.value))
                                : translateOptions(conditionType).filter(item => ['2', '3'].includes(item.value))
                            }
                            optionFilterProp="label"
                            onChange={(value) => {
                                if (value === '2') {
                                    setUseObj({ ...useObj, UseType: '0' })
                                    setMLPVisible(false)
                                } else if(value === '4') {
                                    setMLPVisible(true)
                                } else setMLPVisible(false)
                                // 移除show_type: ''，即此处更改不再重置Transaction Type的值
                                setResultObj({ ...resultObj, condition: value})
                                // setResultObj({ ...resultObj, condition: value, show_type: '' })

                            }}
                        />
                    </Col>
                    <Col span={12} offset={1}>
                        {useObj?.UseType === '1' && resultObj?.condition === '4'
                            ? <Row gutter={[8, 0]}>
                                <Col span={8} className="frank-end">
                                    Coupon Value*
                                </Col>
                                <Col span={14}>
                                    <Input
                                        onChange={(e) => {
                                            const v = e?.target?.value
                                            const REX = /[^0-9.]+/g
                                            if (useObj.UseType === '0') {
                                                v === '0' || REX.test(v)
                                                    ? setMaxFreeITC(null)
                                                    : setMaxFreeITC(deteleStrSpace(v))
                                            } else {
                                                REX.test(v)
                                                    ? setMaxFreeITC(null)
                                                    : setMaxFreeITC(deteleStrSpace(v))
                                            }
                                        }}
                                        type='number'
                                        min={0}
                                        value={maxFreeITC}
                                        className="width-hundred-percent"
                                        prefix="$"
                                        suffix="USD"
                                        ref={maxFreeITCRef}
                                    /> 
                                </Col>
                            </Row>
                            : <Row gutter={[8, 0]}>
                                <Col span={2} className="frank-end">
                                    Buy*
                                </Col>
                                <Col span={6}>
                                    <Input
                                        onChange={(e) => {
                                            const v = e?.target?.value
                                            const REX = /[^0-9.]+/g
                                            if (useObj.UseType === '0') {
                                                v === '0' || REX.test(v)
                                                    ? setBuyValue(null)
                                                    : setBuyValue(deteleStrSpace(v))
                                            } else {
                                                REX.test(v)
                                                    ? setBuyValue(null)
                                                    : setBuyValue(deteleStrSpace(v))
                                            }
                                        }}
                                        type='number'
                                        min={0}
                                        value={buyValue}
                                        className="width-hundred-percent"
                                        prefix="$"
                                        ref={buyRef}
                                    />
                                </Col>
                                <Col span={2} className="frank-end" offset={1}>
                                    Get*
                                </Col>
                                <Col span={6}>
                                    <Input
                                        onKeyUp={
                                            (e) => {
                                                if (e?.target?.value) {
                                                    e.target.value = e.target.value.replace(/[^0-9.]+/g, '')
                                                }
                                            }
                                        }
                                        className="width-hundred-percent"
                                        suffix="USD"
                                        ref={getRef}
                                    />
                                </Col>
                                <Col span={7} className="frank-start">
                                    {
                                        resultObj?.condition === '2' ? 'Credits for free' : 'off'
                                    }
                                </Col>
                            </Row>}
                    </Col>
                    <Col span={4} className="frank-end">
                        Valid Date (UTC)*
                    </Col>
                    <Col span={7}>
                        <RangePicker
                            showTime={{
                                hideDisabledOptions: false,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                            }}
                            format='YYYY-MM-DD HH:mm'
                            defaultValue={[moment().startOf('day'), moment().add(1, 'years').startOf('day')]}
                            onChange={(data, datastring) => setResultObj({ ...resultObj, start_time: moment(datastring[0]).format('YYYY-MM-DD HH:mm'), end_time: moment(datastring[1]).format('YYYY-MM-DD HH:mm') })}
                            className="width-hundred-percent"
                            ranges={{
                                '7 days': [moment(), moment().add(7, 'days')],
                                '1 month': [moment(), moment().add(1, 'months')],
                                '6 months': [moment(), moment().add(6, 'months')],
                                '1 Year': [moment(), moment().add(1, 'years')],
                                '2 Years': [moment(), moment().add(2, 'years')]
                            }}
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={4} className="frank-end">
                        Usage# for the same user
                    </Col>
                    <Col span={7}>
                        <Select
                            onChange={(value) => setResultObj({ ...resultObj, usage_limit: value })}
                            defaultValue={'1'}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            disabled={resultObj.specify_coupon === 1}
                            // showSearch
                            options={translateOptions(usage)}
                        />
                    </Col>
                    <Col span={1}></Col>
                    {
                        ['1', '3'].includes(useObj?.UseType) &&
                        <>
                            <Col span={4} className="frank-end">
                                Can Use Balance
                            </Col>
                            <Col span={7}>
                                <Select
                                    value={useObj?.CanUseBalance}
                                    className="width-hundred-percent"
                                    placeholder='Can Use Balance ?'
                                    defaultValue={0}
                                    disabled={resultObj?.condition === '4'}
                                    options={[
                                        { 'label': 'NO', 'value': 0 },
                                        { 'label': 'YES', 'value': 1 }
                                    ]}
                                    onChange={(value) => {
                                        setUseObj({ ...useObj, CanUseBalance: value })
                                    }}
                                // optionFilterProp="label"
                                />
                            </Col>
                        </>
                    }

                </Row>
                {
                    useObj.UseType === '1' && <Row gutter={[8, 8]} className="usetype-voucher">
                        <UsetypeVoucher value={maxFreeITC} view={MLPVisible} ref={usetypeVoucherRef} />
                    </Row>
                }
                {
                    useObj.UseType === '3' && <Row gutter={[8, 8]} className="usetype-voucher">
                        <LanguageTestCoupon ref={languageTestCouponRef} />
                    </Row>
                }
                <Row gutter={[8, 8]} className="user-condition">
                    <UserCondition ref={userConditionRef} getIdentity={(v) => setIdentity(v)} />
                </Row>
                <Row gutter={[8, 8]} className="time-condition">
                    <TimeCondition ref={timeConditionRef} />
                </Row>
                {identity !== '1' && <Row gutter={[8, 8]} className="purchase-condition">
                    <PurchaseCondition ref={purchaseConditionRef} />
                </Row>}
                <Row gutter={[8, 8]} className="validate-condition">
                    <ValidateCondition ref={validateConditionRef} />
                </Row>
            </Spin>
            <CommonLog submitLog={submitLog} ref={commonLogRef} title={'Voucher Campaign Request'} />
        </Modal>
    )
})

export default CreateCoupon;
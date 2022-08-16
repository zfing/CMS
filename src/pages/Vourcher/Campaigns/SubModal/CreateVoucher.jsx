import React, { useImperativeHandle, useState, useRef } from 'react';
import { Modal, Spin, Row, Col, Select, Tooltip, Input, DatePicker, notification } from 'antd';
import {
    voucherShowType,
    regional,
    amount,
    usage,
    eachAmount
} from '../../CommonConst';
import {
    vtObj, commonFilter, translateOptions, deteleStrSpace
} from '../../../../components/CommonComponent/CommonFunction';
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment';
import UserCondition from './UserCondition';
import TimeCondition from './TimeCondition';
import PurchaseCondition from './PurchaseCondition';
import CommonLog from '../../../../components/CommonComponent/CommonLog';
import oldApi from '../../../../components/Api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateVoucher = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [campaignCodeValue, setcampaignCodeValue] = useState(null);
    const [resultObj, setResultObj] = useState({ 
        condition: '1', 
        regional: '1',
        usage_limit: '1', 
        specify_coupon: '0', 
        start_time: moment().startOf('day').format('YYYY-MM-DD HH:mm'), 
        end_time:moment().startOf('day').add(1, 'years').format('YYYY-MM-DD HH:mm')
    });
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [voucherAmount, setVoucherAmount] = useState('');
    const [onceAmount, setOnceAmount] = useState('');
    const generationRef = useRef(null);
    const eachGenerationRef = useRef(null);
    const userConditionRef = useRef(null);
    const timeConditionRef = useRef(null);
    const purchaseConditionRef = useRef(null);
    const voucherUsdRef = useRef(null);
    const campaignCodeRef = useRef(null);
    const campaignDescRef = useRef(null);
    const commonLogRef = useRef(null);
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
        if (resultObj.show_type && campaignCodeRef?.current?.state?.value && resultObj.regional &&
            generationRef?.current?.state?.value && campaignDescRef?.current?.state?.value &&
            eachGenerationRef?.current?.state?.value && voucherUsdRef?.current?.state?.value) {
            commonLogRef.current.openLog();
        } else {
            notification.info({
                message: 'Tips',
                description: 'Please enter required fields.'
            })
        }
        /*{
 UseLimitUSD:100,// Buy $x get x USD for free, Buy $x get $x off. (condition=2||3, has this attr)
 UseLimitITC:10000,
 UserCondition: {
 UserIdentity:0,// 0: Unlimited, 1:Non-paid users only,2:Paid users,3:Professional teacher,4:Community tutor
 RefSource:0,// 0:Unlimited, 1:Partnership, 2:Source code, 3:Global site, 4:CN site
 RefSourceCode:'',// eg:'BEYONET' if RefSource==2,
 FromCountry:'CN',// '':Unlimited, 'CN','AF'......
 NativeLanguage:'chinese',//'':Unlimited, 'english'......
 LearnLanguage:'english',
 TeachLanguage:''
 },
 TimeCondition:{
 RegRange:{
 Start:'1900-01-01',
 End:'',
 },
 LoginDays:30,// Login within x days, 0 or '' Unlimited
 SuspendRegDays:30,//Registered user with x days (who didn't make any purchase), 0 or '' Unlimited
 AllAbove:'0',//0:Either of those above,1:All above
 },
 PurchaseCondition:{
 LessonStatus:2,// 1:Lesson requested,2:Lesson completed, other Unlimited
 PackageStatus:1,// 1:Package requested,2:Package completed, other Unlimited
 BoughtUSD:100,
 BoughtITC:10000,// The amount of a single purchase
 BoughtTimeRange:{
 Start:'2017-01-01',
 End:'2017-02-01',
 }
 BoughtProduct:'1',// 1:OOPT
 AllAbove:'0'//0:Either of those above,1:All above
 }
 }*/
    }
    const submitLog = (submit, value) => {
        setLoading(true);
        setModalLoading(true);
        let postData = {
            ...resultObj,
            voucher_amount: generationRef?.current?.state?.value ? generationRef.current.state.value : '',
            voucher_once_count: eachGenerationRef?.current?.state?.value ? eachGenerationRef.current.state.value : '',
            category_code: deteleStrSpace(campaignCodeRef?.current?.state?.value),
            remark: campaignDescRef?.current?.state?.value ? campaignDescRef.current.state.value : '',
            voucher_value: commonFilter('usdToCent', voucherUsdRef?.current?.state?.value ? voucherUsdRef.current.state.value : ''),
            voucherValueUsd: voucherUsdRef?.current?.state?.value ? voucherUsdRef.current.state.value : '',
            condition_json: JSON.stringify({ 
                UserCondition: userConditionRef?.current.getValue(),
                TimeCondition: timeConditionRef?.current.getValue(), 
                PurchaseCondition:identity !== '1' ? purchaseConditionRef?.current.getValue() : {}
            }),
            operate: 'create_campaign',
            log_note: value
        }
        oldApi.post('voucher/campaign/create', postData).then(
            res => {
                notification.info({
                    message: 'Success'
                })
                setVisible(false);
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
            }}
            confirmLoading={loading}
            destroyOnClose
            width={'85vw'}
            onOk={confirm}
        >
            <Spin spinning={modalLoading}>
                <Row gutter={[8, 8]} className="basic-information">
                    <Col span={4} className="frank-end">
                        Transaction Type*
                    </Col>
                    <Col span={7}>
                        <Select
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value) => setResultObj({ ...resultObj, show_type: value })}
                        >
                            {voucherShowType.map((item) => {
                                return <Option value={item.v} key={item.v}>
                                    {item.t}
                                </Option>
                            })}
                        </Select>
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
                    <Col span={1}>

                    </Col>
                    {/* second */}
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
                            disabled={voucherAmount !== '0'} />
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
                    {/* third */}
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
                            onBlur={() => {
                                console.log(campaignCodeRef.current.state.value)
                            }}
                            placeholder="Campaign Code must be characters ('A-Z','a-z','0-9')"
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    {/* fourth */}
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
                    {/* fifth */}
                    <Col span={4} className="frank-end">
                        Voucher USD*
                    </Col>
                    <Col span={7}>
                        <Input
                            onInput={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value < 0 ? 0 : e.target.value
                                    }
                                }}
                            onKeyUp={
                                (e) => {
                                    if (e?.target?.value) {
                                        e.target.value = e.target.value.replace(/[^0-9.]+/g, '')
                                    }
                                }
                            }
                            ref={voucherUsdRef}
                        />
                    </Col>
                    <Col span={11}>
                    </Col>
                    {/* sixth */}
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
                            onChange={(value) => setResultObj({...resultObj,usage_limit:value})}
                            defaultValue={'1'}
                            className="width-hundred-percent"
                            placeholder={'Choose'}
                            disabled={resultObj.condition !== '1'}
                            // showSearch
                            options={translateOptions(usage)}
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="user-condition">
                    <UserCondition ref={userConditionRef} getIdentity={(v) => setIdentity(v)} />
                </Row>
                <Row gutter={[8, 8]} className="time-condition">
                    <TimeCondition ref={timeConditionRef} />
                </Row>
                {identity !== '1' && <Row gutter={[8, 8]} className="time-condition">
                    <PurchaseCondition ref={purchaseConditionRef} />
                </Row>}
            </Spin>
            <CommonLog submitLog={submitLog} ref={commonLogRef} title={'Voucher Campaign Request'} />
        </Modal>
    )
})

export default CreateVoucher;
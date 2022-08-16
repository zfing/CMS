import React, { useImperativeHandle, useState, useRef } from 'react';
import { Modal, Spin, Row, Col, Select, Tooltip, Input, DatePicker, notification, message } from 'antd';
import {
  allShowType,
  regional,
  remainNumber,
  usage,
  conditionType,
  lessonCouponTypes,
  currentUserTeamId,
  purchaseCouponTypes
} from '../../CommonConst';
import {
  vtObj, commonFilter, translateOptions, matchULN, deteleStrSpace
} from '../../../../components/CommonComponent/CommonFunction';
import moment from 'moment';
import UserCondition from './UserCondition';
import TimeCondition from './TimeCondition';
import PurchaseCondition from './PurchaseCondition';
import CommonLog from '../../../../components/CommonComponent/CommonLog.tsx';
import oldApi from '../../../../components/Api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const GenericCoupon = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [identity, setIdentity] = useState();
  const [resultObj, setResultObj] = useState({
    show_type: '',
    regional: '1',
    voucher_condition:'2',
    user_use_number: 1,
    start_time: moment().format('YYYY-MM-DD'),
    end_time: moment().add(1, 'years').format('YYYY-MM-DD')
  });
  const [useObj, setUseObj] = useState({ UseType: '0' });
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [onceAmount, setOnceAmount] = useState('');
  const eachGenerationRef = useRef(null);
  const userConditionRef = useRef(null);
  const timeConditionRef = useRef(null);
  const purchaseConditionRef = useRef(null);
  const campaignCodeRef = useRef(null);
  const campaignDescRef = useRef(null);
  const commonLogRef = useRef(null);
  const usetypeVoucherRef = useRef(null);
  const buyRef = useRef(null);
  const getRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: (title) => {
      setTitle(title);
      setVisible(true);
    }
  }))

  const confirm = () => {
    if (resultObj.show_type
      && resultObj.regional
      && resultObj.voucher_name
      && campaignCodeRef?.current?.state?.value
      && useObj.UseType
      && buyRef?.current?.state?.value
      && getRef?.current?.state?.value
      && campaignDescRef?.current?.state?.value
      ) {
        if(onceAmount === '0' && !eachGenerationRef?.current?.state?.value) {
           message.warning('The total number of coupons to use is none')
        } else {
          commonLogRef.current.openLog()
        }
    } else {
      notification.info({
        message: 'Tips',
        description: 'Please enter required fields.'
      })
    }
    setOnceAmount('')
  }
  const submitLog = (submit, value) => {
    setLoading(true);
    setModalLoading(true);
    let postData = {
      ...resultObj,
      remain_number: eachGenerationRef?.current?.state?.value,
      remark: campaignDescRef?.current?.state?.value,
      voucherValueUsd: getRef?.current?.state?.value,
      voucher_value: commonFilter('usdToCent', getRef?.current?.state?.value),
      condition_json: JSON.stringify({
        UserCondition: userConditionRef?.current?.getValue(),
        TimeCondition: timeConditionRef?.current?.getValue(),
        PurchaseCondition: purchaseConditionRef?.current?.getValue(),
        UseLimitUSD: buyRef?.current?.state?.value,
        UseLimitITC: commonFilter('usdToCent', buyRef?.current?.state?.value),
        // UseType: useObj?.UseType
      }),
      operate: 'create_generic',
      log_note: value
    }
    if (useObj.UseType === '1') {
      postData['condition_json']['SessionCondition'] = usetypeVoucherRef.current.getValue();
    }
    oldApi.post('voucher/generic/create', postData)
    .then(res => {
        notification.info({
          message: 'Success'
        })
        setVisible(false);
        setIdentity()
        props.freshList()
      })
    .catch(err => {
        notification.error({
          message: 'Error',
          description: err?.response?.data?.error?.msg
        })
      })
    .finally(() => {
        setModalLoading(false);
        setLoading(false);
      }
    )
    setIdentity('')
  }
  const handleTransactionType = v => {
    setResultObj({ ...resultObj, show_type: v })
  }
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={() => {
        setVisible(false)
        setOnceAmount('')
        setIdentity('')
      }}
      confirmLoading={loading}
      destroyOnClose
      width={'85vw'}
      onOk={confirm}
      okText='Confirm'
    >
      <Spin spinning={modalLoading}>
        <Row gutter={[8, 8]} className="basic-information">
          <Col span={4} className="frank-end">
            Transaction Type*
          </Col>
          <Col span={7}>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={resultObj.show_type || undefined}
              className="width-hundred-percent"
              placeholder='Choose'
              showSearch
              options={
                useObj.UseType === '1'
                  ? translateOptions(allShowType).filter(item =>
                    lessonCouponTypes.includes(item.value) && (currentUserTeamId === 1 || item.value.substr(0, 3) === currentUserTeamId.toString())
                  )
                  : translateOptions(allShowType).filter(item =>
                  (purchaseCouponTypes.includes(item.value)
                    &&
                    (currentUserTeamId === 1 || item.value.substr(0, 3) === currentUserTeamId.toString()))
                  )
              }
              optionFilterProp="label"
              onChange={(v) => handleTransactionType(v)}
            />
          </Col>
          <Col span={5} className="frank-end">
            Regional*
          </Col>
          <Col span={7}>
            <Select
              className="width-hundred-percent"
              showSearch
              getPopupContainer={triggerNode => triggerNode.parentNode}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder={'Choose'}
              defaultValue={resultObj.regional}
              onChange={(value) => setResultObj({ ...resultObj, regional: value })}
            >
              {vtObj(regional).map((item) => {
                return <Option value={item.v} key={item.v}>
                  {item.t}
                </Option>
              })}
            </Select>
          </Col>
          <Col span={4} className="frank-end">
            Coupon Name*
          </Col>
          <Col span={7}>
            <Input
              onBlur={(e) => {
                let v = e?.target?.value
                if (v) {
                  matchULN(v) ? setResultObj({ ...resultObj, voucher_name: v }) : message.warning('The input format of Coupon Name is wrong')
                } setResultObj({ ...resultObj, voucher_name: v })
              }}
              placeholder="Coupon Name must be characters ('A-Z','a-z','0-9')"
            />
          </Col>
          <Col span={5} className="frank-end">
            <Tooltip placement={'bottom'} title="Setting the total number of coupons to use">
              Usage# for total <i className='fa fa-question-circle' />*
            </Tooltip>
          </Col>
          <Col span={4}>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              className="width-hundred-percent"
              placeholder={'Choose'}
              showSearch
              defaultValue={''}
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
              {vtObj(remainNumber).map((item) => {
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
            <Tooltip placement={'bottom'} title="User's coupon code">
              Coupon Code <i className='fa fa-question-circle' />*
            </Tooltip>
          </Col>
          <Col span={19}>
            <Input
              ref={campaignCodeRef}
              onBlur={(e) => {
                let v = e?.target?.value
                if (v) {
                  matchULN(v) ? setResultObj({ ...resultObj, voucher_code: deteleStrSpace(v) }) : message.warning('The input format of Coupon Code is wrong')
                }
              }}
              placeholder="Coupon Code must be characters ('A-Z','a-z','0-9')"
            />
          </Col>
          <Col span={1}>
          </Col>
          <Col span={4} className="frank-end">
            Coupon Desc*
          </Col>
          <Col span={19}>
            <TextArea
              ref={campaignDescRef}
              rows="4" />
          </Col>
          <Col span={4} className="frank-end">
            Condition Type
          </Col>
          <Col span={7}>
            <Select
              defaultValue={resultObj?.voucher_condition}
              className="width-hundred-percent"
              placeholder="Choose"
              showSearch
              options={translateOptions(conditionType).filter(item => ['2', '3'].includes(item.value))}
              optionFilterProp="label"
              onChange={(value) => {
                if (value === '2') {
                  setUseObj({ ...useObj, UseType: '0' })
                };
                setResultObj({ ...resultObj, voucher_condition: value })
                // setResultObj({ ...resultObj, voucher_condition: value, show_type: '' })
              }}
            />
          </Col>
          <Col span={12}>
            <Row gutter={[8, 0]}>
              <Col span={2} offset={2} className="frank-end">
                Buy*
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
                  prefix="$"
                  ref={buyRef}
                />
              </Col>
              <Col span={2} className="frank-end">
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
                  // suffix="USD"
                  ref={getRef}
                />
              </Col>
              <Col span={6} className="frank-start">
                {
                  resultObj?.voucher_condition === '2' ? 'USD Credits for free' : 'USD off'
                }
              </Col>
            </Row>
          </Col>
          <Col span={4} className="frank-end">
            Valid Date (UTC)*
            </Col>
          <Col span={7}>
            <RangePicker
              defaultValue={[moment(), moment().add(1, 'years')]}
              onChange={(data, datastring) => setResultObj({ ...resultObj, start_time: moment(datastring[0]).format('YYYY-MM-DD'), end_time: moment(datastring[1]).format('YYYY-MM-DD') })}
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
              // onChange={(value) => setResultObj({ ...resultObj, usage_limit: value })}
              defaultValue={'1'}
              className="width-hundred-percent"
              placeholder={'Choose'}
              showSearch
              options={translateOptions(usage)}
              disabled={resultObj?.voucher_condition !== '1'}
            />
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="user-condition">
          <UserCondition 
            ref={userConditionRef} 
            getIdentity={(value) => setIdentity(value)}
          />
        </Row>
        <Row gutter={[8, 8]} className="time-condition">
          <TimeCondition ref={timeConditionRef} identity={identity} />
        </Row>
        {
          identity !== '1' &&
          <Row gutter={[8, 8]} className="purchase-condition">
            <PurchaseCondition ref={purchaseConditionRef} />
          </Row>
        }
      </Spin>
      <CommonLog submitLog={submitLog} ref={commonLogRef} title={'Generic Coupon Request'} />
    </Modal>
  )
})

export default GenericCoupon;
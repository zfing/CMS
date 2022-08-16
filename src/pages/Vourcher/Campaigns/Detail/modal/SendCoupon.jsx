import React, { useState, useRef } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Row, Checkbox, message, Button } from "antd";
import moment from 'moment';
const { RangePicker } = DatePicker;
const SendCoupon = (props) => {
  const { item, params: { visible, title, type }, onCancel, onData } = props
  const [checked, setChecked] = useState(false)
  const textAreaRef = useRef(null)
  const handleOnCancel = () => {
    onCancel()
    setChecked(false)
  }
  const tailLayout = {
    wrapperCol: { span: 24 },
    style: {
      margin: '20px 0 -20px',
      padding: '20px 0',
      borderTop: '1px #f0f0f0 solid'
    }
  };
  const onFinish = (values) => {
    const { usd, count, dateTime, user_id_s } = values
    let userIds = []
    if(user_id_s) {
      let userArr = []
      if (user_id_s.includes('\n')) {
        userArr = user_id_s.split('\n')
      } else if(user_id_s.includes(',')) {
        userArr = user_id_s.split(',')
      } else {
        userArr.push(user_id_s)
      }
      userArr.map(item => userIds.push(item))
    }
    if (userIds.length > item.voucher_once_count) {
      message.warning('The number of user IDs exceeds maximum amount per time allowed to generate vouchers')
      return
    }
    if(!count) {
      message.warning(`Number of ${type} is null`)
      return
    }
    if (+new Date(dateTime[1]) < +new Date()) {
      message.warning('The end time cannot be less than the current time')
      return
    }
    if (checked) {
      if (!user_id_s) {
        message.warning("User ID Can't be empty")
        return
      }
    } else {
      if (type === 'Coupons' && !user_id_s) {
        message.warning("User ID Can't be empty")
        return
      }
    }
    const params = {
      usd,
      count,
      start_time: dateTime[0].format('YYYY-MM-DD HH:mm'),
      end_time: dateTime[1].format('YYYY-MM-DD HH:mm'),
      user_id_s: userIds
    }
    onData({
      ...params,
      operate: "generate_vouchers"
    })
    setChecked(false)
  };
  const addUserId = <>
    <Form.Item name='user_id_s' label="User ID">
      <Input.TextArea ref={textAreaRef} style={{ maxWidth: '100%' }} />
    </Form.Item>
    <Row justify='end'>Please input the specified user's ID in each line in the Text Area above.</Row>
  </>
  const validateMessages = {
    number: {
      // eslint-disable-next-line no-template-curly-in-string
      range: '${label} can not exceeds maximum amount per time allowed to generate vouchers,must be between ${min} and ${max}',
    },
  }
  return (
    <Modal
      title={title}
      visible={visible}
      okText="Confirm"
      destroyOnClose
      maskClosable={false}
      onCancel={handleOnCancel}
      width='600px'
      footer={null}
    >
      <Form
        colon={false}
        wrapperCol={{ span: 18 }}
        labelCol={{ span: 6 }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item label="Campaign">
          <span className='font-weight-bolder'>{item?.category_code}</span>
        </Form.Item>
        <Form.Item name='usd'
          label={`${type} Value (USD)`}
          initialValue={item?.voucher_value / 100}
        >
          <Input disabled={item?.voucher_value > 0} />
        </Form.Item>
        <Form.Item name='count'
          label={`Number of ${type}`}
          initialValue={1}
          rules={[{ 
            type: 'number',
            min: 1, 
            max: item.voucher_once_count
          }]}
        >
          <InputNumber placeholder='Please enter the number' min={1} style={{ width: '100%' }} disabled={type === 'Coupons' && item?.usage_limit === 1} />
        </Form.Item>
        <Form.Item name='dateTime' label="Validity Date (UTC)"
          initialValue={[moment(item.start_time, 'YYYY-MM-DD HH:mm'), moment(item.end_time, 'YYYY-MM-DD HH:mm')]}
        >
          <RangePicker
            showTime={{
              hideDisabledOptions: false,
              defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
            }}
            format='YYYY-MM-DD HH:mm'
            className="width-hundred-percent"
            style={{ marginTop: "5px" }}
            ranges={{
              '7 days': [moment(), moment().add(7, 'days')],
              '1 month': [moment(), moment().add(1, 'months')],
              '6 months': [moment(), moment().add(6, 'months')],
              '1 Year': [moment(), moment().add(1, 'years')],
              '2 Years': [moment(), moment().add(2, 'years')]
            }}
            allowClear={false}
          />
        </Form.Item>
        {checked ? addUserId : null}
        {/* 当限制只能用一次 usage_limit === 1 的时候，不再显示  Assign to user account 选项*/}
        {type === 'Coupons'
          ? null
          : item?.usage_limit !== 1 && <Row justify='end'>
            <Checkbox checked={checked} onClick={e => setChecked(e.target.checked)} /> &nbsp;
              <span
              style={{ color: checked ? '#5db2ff' : '#000' }}
              className='font-weight-bolder'
            >
              Assign to user account
              </span>
          </Row>
        }
        <Form.Item {...tailLayout}>
          <Row justify='end'>
            <Button onClick={handleOnCancel} className='margin-right-10'> Cancle </Button>
            <Button type="primary" htmlType="submit"> Confirm </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendCoupon;

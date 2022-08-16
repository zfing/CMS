import React, { useState } from "react";
import { Modal, DatePicker, Checkbox } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const ChangeValidTime = (props) => {
  const { item, type, visible, onCancel, onData } = props
  const [tempData, setTempData] = useState({ 'start_time': moment(item.start_time).format("YYYY-MM-DD"), 'end_time': moment(item.end_time).format("YYYY-MM-DD") })
  const [checked, setChecked] = useState(0)
  const flag = type === 'campaigns'
  const handleCheckBox = (e) => {
    e.target.checked ? setChecked(1) : setChecked(0)
  }
  return (
    <Modal
      title={flag ? "Change voucher's valid time" : "Change generic voucher's valid time"}
      visible={visible}
      okText="Confirm"
      onOk={() => {
        const { start_time, end_time } = tempData;
        if (!start_time || !end_time) return
        const params = flag ? { ...tempData, change_voucher_flag: checked } : { ...tempData }
        onData(params)
        onCancel()
      }}
      onCancel={() => onCancel()}
      destroyOnClose
    >
      <h4>Select date range</h4>
      <RangePicker
        showTime={flag && {
          hideDisabledOptions: false,
          defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
        }}
        defaultValue={[moment(item.start_time).utc(), moment(item.end_time).utc()]}
        format={flag ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'}
        className="width-hundred-percent"
        style={{ marginTop: "5px" }}
        ranges={{
          '7 days': [moment(), moment().add(7, 'days')],
          '1 month': [moment(), moment().add(1, 'months')],
          '6 months': [moment(), moment().add(6, 'months')],
          '1 Year': [moment(), moment().add(1, 'years')],
          '2 Years': [moment(), moment().add(2, 'years')]
        }}
        onChange={(v) => {
          if (!v) {
            setTempData({})
            return
          }
          const [start_time, end_time] = v;
          setTempData((tempData) => ({
            ...tempData,
            start_time: flag ? moment(start_time).format("YYYY-MM-DD HH:mm") : moment(start_time).format("YYYY-MM-DD"),
            end_time: flag ? moment(end_time).format("YYYY-MM-DD HH:mm") : moment(end_time).format("YYYY-MM-DD"),
          }));
        }}
      />
      {
        type === 'campaigns' && <div className='margin-top-10' style={{ textAlign: 'right' }}>
          <Checkbox
            onClick={handleCheckBox}
          /> &nbsp;
          <span style={{ fontWeight: 500 }}>Change voucher's valid time</span>
        </div>
      }

    </Modal>
  )
}
export default ChangeValidTime
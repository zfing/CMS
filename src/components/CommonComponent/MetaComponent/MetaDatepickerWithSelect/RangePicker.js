import React, { useState,useImperativeHandle } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const datePicker = React.forwardRef((props, ref) => {
    const { selObj } = props;
    const [dateArr, setDateArr] = useState([]);

    const getDatePickerValue = (data, datastring) => {
        setDateArr([datastring[0], datastring[1]])
    }
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return dateArr;
        }
    }))
    return (
        <RangePicker
            defaultValue={[selObj.defaultStartTime, selObj.defaultEndTime]}
            className="flex-1"
            ranges={{
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                'This Year': [moment().startOf('year'), moment().endOf('year')],
                'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
            }}
            onChange={getDatePickerValue.bind(this)}
        />
    )
})
export default datePicker;
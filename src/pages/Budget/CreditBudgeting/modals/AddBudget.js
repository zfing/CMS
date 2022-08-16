import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Modal,
  Row,
  Col,
  Select,
  Button,
  Radio,
  Form,
  Input,
  message,
} from "antd";
import {
  commonFilter,
  getCurYear,
  sum,
  monthsShort,
} from "../../../../components/CommonComponent/CommonFunction";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { check_has_budget } from "../service";

const AddBudget = forwardRef((props, ref) => {
  const { costCenter, fresh, type } = props;
  const [totalAmountArr, setTotalAmountArr] = useState(new Array(12).fill(0));
  const [budgetAmountTotal, setBudgetAmountTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [changeYear, setChangeYear] = useState(0);
  const [selectCostCenter, setSelectCostCenter] = useState(0);
  const [checked, setChecked] = useState(1);
  const [checkHasBudget, setCheckHasBudget] = useState(0);
  const [budgetVisible, setBudgetVisible] = useState(false);
  const [values, setValues] = useState({});
  const [costCenterArr, setCostCenterArr] = useState([]);
  const [costCenterName, setCostCenterName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [tips, setTips] = useState(null);
  const [record, setRecord] = useState({});
  const [form] = Form.useForm();
  useEffect(() => {
    const arr = costCenter?.filter((item) => item.category === "COSTCENTER");
    setCostCenterArr(arr);
    setCheckHasBudget(0);
  }, [costCenter,changeYear, selectCostCenter]);

  useEffect(() => {
    setChecked(type === "Edit" ? 2 : 1);
    setChangeYear(type === "Edit" ? record.year : 0);
    setSelectCostCenter(type === "Edit" ? record.costcenter_code : 0);
    setTotalAmountArr(
      type === "Edit"
        ? JSON.parse(JSON.stringify(record.budget_amount_monthly_s_))
        : new Array(12).fill(0)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useImperativeHandle(ref, () => ({
    openAddBudget: (record) => {
      setRecord(record);
      if(JSON.stringify(record) !== '{}' && record?.budget_amount_monthly_s_) {
        setTotalAmountArr(JSON.parse(JSON.stringify(record?.budget_amount_monthly_s_)))
      }
      setBudgetVisible(true);
      setBudgetAmountTotal(0);
      setMonthlyTotal(0);
    },
  }));
  
  const getCentersName = (v) => {
    return costCenterArr.find((item) => item.code === v).name;
  };
  const cancel = () => {
    setBudgetVisible(false);
    setChecked(type === "Edit" ? 2 : 1);
    if(type === 'Add') {
      setChangeYear(0)
      setSelectCostCenter(0)
      setTotalAmountArr(new Array(12).fill(0))
    }
  };
  // 编辑 | 添加
  const submit = async (log_note) => {
    let monthly = [];
    const postData = {
      year: changeYear,
      costcenter_code: selectCostCenter,
      log_note,
      budget_amount_total:
        checked === 1
          ? Number(values.amount_monthly_s) * 100 * 12
          : Number(monthlyTotal),
    };
    const form = new FormData();
    for (const key in postData) {
      form.append(key, postData[key]);
    }
    if(checked === 1) {
      for (let i = 0; i < 12; i++) {
        monthly.push({
          amount_monthly_s: Number(values.amount_monthly_s) * 100,
        });
      }
      monthly.map((item) => form.append("amount_monthly_s", item["amount_monthly_s"]));
    } else {
      monthly = Object.values(values)
      monthly.map((item) => form.append("amount_monthly_s", parseInt(Number(item) * 100)));
    }
    switch (type) {
      case "Add":
        form.append("operate", "add_budget");
        break;
      case "Edit":
        form.append("operate", "edit_budget");
        form.append("id", record.id);
        break;
      default:
        return null;
    }
    check_has_budget(form)
      .then((res) => {
        logModal.onCancel();
        const {
          data: { data },
        } = res;
        if (data.success === 1) {
          message.success("success");
          setTotalAmountArr(totalAmountArr)
          cancel();
          fresh();
        }
      })
      .catch((err) => {
        message.error(err?.error?.msg);
      });
  };
  const selectYears = () => {
    let selectYears = [];
    let curYear = getCurYear();
    for (let year = curYear + 1; year >= 2010; year--) {
      selectYears.push(year);
    }
    return selectYears;
  };
  const checkedChange = (e) => {
    setChecked(e.target.value);
  };
  // 添加校验 | 编辑不校验
  const finish = (values) => {
    setValues(values);
    const tip = `For ${type === 'Edit' 
      ? getCentersName(record?.costcenter_code) 
      : costCenterName}, 
      Year: ${changeYear}, 
      Total Budget(USD): $${commonFilter(
        "centToUsd",
        checked === 1 ? budgetAmountTotal * 100 * 12 : monthlyTotal
      )}`;

    if (type === "Add") {
      setLoading(true);
      const form = new FormData();
      form.append("operate", "check_has_budget");
      form.append("year", changeYear);
      form.append("costcenter_code", selectCostCenter);

      check_has_budget(form)
        .then((res) => {
          const {
            data: { data },
          } = res;
          if (data === 0) {
            logModal.onShow();
            setTips(tip);
          }
          setCheckHasBudget(data);
        })
        .catch((err) => message.err(err?.error?.msg))
        .finally((_) => setLoading(false));
    } else {
      logModal.onShow();
      setTips(tip);
    }
  };
  const Average = (
    <Form.Item
      name="amount_monthly_s"
      label="Average monthly"
      initialValue={0 || budgetAmountTotal}
      rules={[{ required: true, message: "can't be empty" }]}
    >
      <Input
        placeholder=""
        onChange={(e) => setBudgetAmountTotal(e.target.value)}
      />
    </Form.Item>
  );
  const Custom = (
    <Row justify="space-between">
      {monthsShort().map((item, index) => {
        return (
          <Col span={7} key={item}>
            <Form.Item
              name={item}
              initialValue={totalAmountArr[index] / 100}
              label={item}
            >
              <Input
                placeholder=""
                onChange={(e) => {
                  totalAmountArr[index] = Number(e.target.value) * 100; // 给对应位置赋值
                  setTotalAmountArr(totalAmountArr); // 新数组替换旧数组
                  return setMonthlyTotal(sum(totalAmountArr)); // 计算数组所有值的总额
                }}
              />
            </Form.Item>
          </Col>
        );
      })}
    </Row>
  );
  return (
    <>
      <Modal
        width="50%"
        destroyOnClose
        title={`${type} the budget`}
        visible={budgetVisible}
        maskClosable={false}
        onCancel={cancel}
        footer={[
          <Button key="1" onClick={cancel}>
            Cancle
          </Button>,
          <Button
            key="2"
            type="primary"
            disabled={
              !changeYear ||
              !selectCostCenter ||
              (checked === 1
                ? !Number(budgetAmountTotal)
                : !Number(monthlyTotal))
            }
            onClick={form.submit}
            loading={loading}
          >
            Confirm
          </Button>,
        ]}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <div>Cost Center</div>
            <Select
              style={{ width: "100%" }}
              value={
                type === "Edit" ? record?.costcenter_code : selectCostCenter
              }
              onChange={(value, key) => {
                setSelectCostCenter(value);
                setCostCenterName(key.children);
              }}
              disabled={type === 'Edit'}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value={0} key="0">
                Choose
              </Select.Option>
              {costCenter.length > 0 &&
                costCenterArr?.map((item) => (
                  <Select.Option value={item.code} key={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Col>
          <Col span={12}>
            <div>Year</div>
            <Select
              style={{ width: "100%" }}
              value={type === "Edit" ? record.year : changeYear}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={(value) => setChangeYear(value)}
              disabled={type === 'Edit'}
            >
              <Select.Option value={0} key="0">
                Choose
              </Select.Option>
              {selectYears()?.map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row className="margin-top-15 padding-bottom-20 default-font">
          Total Budget(USD): &nbsp;
          <span className="text-bold">
            $
            {checked === 1
              ? commonFilter("centToUsd", budgetAmountTotal * 100 * 12)
              : type === "Edit"
              ? commonFilter(
                  "centToUsd",
                  monthlyTotal || record.budget_amount_total
                )
              : monthlyTotal / 100 + ".00"}
          </span>
        </Row>
        {checkHasBudget !== 0 && (
          <p className="color-red">{`${changeYear} ${costCenterName} credit budget has been set`}</p>
        )}
        <div className="budget-monthly-title">Monthly Budget (USD)</div>
        <Radio.Group
          style={{ width: "100%" }}
          value={checked}
          onChange={checkedChange}
          className="margin-bottom-15"
        >
          <Row>
            <Col span={12}>
              <Radio value={1}>Average monthly amount</Radio>
            </Col>
            <Col span={12}>
              <Radio value={2}>Custom monthly amount</Radio>
            </Col>
          </Row>
        </Radio.Group>
        <Form
          onFinish={finish}
          form={form}
          preserve={false}
          layout={checked === 1 ? null : "vertical"}
          labelCol={checked === 1 ? { span: 6, offset: 2 } : null}
          labelAlign={checked === 1 ? "left" : null}
        >
          {checked === 1 ? Average : Custom}
        </Form>
      </Modal>
      <WriteLog
        title={`${type} the budget`}
        onRef={(ref) => setLogModal(ref)}
        onOk={submit}
        tips={tips}
      />
    </>
  );
});
export default AddBudget;

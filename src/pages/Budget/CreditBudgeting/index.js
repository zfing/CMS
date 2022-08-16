import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  message,
  Spin,
  Menu,
  Dropdown,
  Tooltip,
  Select,
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import HasPermi from "../../../components/CommonComponent/PermissionControl";
import MoreInformation from "../../../components/CommonComponent/MoreInformation";
import { commonFilter, getCurYear } from "../../../components/CommonComponent/CommonFunction";
import AddBudget from "./modals/AddBudget";
import {
  get_budget_years,
  get_budgeting_List,
  getCostCenters,
} from "./service";

const CreditBudgeting = () => {
  const defaultCurrentYear = getCurYear();
  const [loading, setLoading] = useState(true);
  const [fresh, setFresh] = useState(false);
  const [costCenter, setCostCenter] = useState([]);
  const [data, setData] = useState([]);
  const AddBudgetRef = useRef(null);
  const [rowKeys, setRowKeys] = useState([]);
  const [years, setYears] = useState([]);
  const [selectYear, setSelectYear] = useState(defaultCurrentYear);
  const [openType, setOpenType] = useState('Add');
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    get_years();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh]);
  useEffect(() => {
    get_cost_center();
  }, [])
  const get_years = async () => {
    try {
      let {
        data: { data },
      } = await get_budget_years();
      setYears(data);
    } catch (err) {
      message.error(err?.error?.msg);
    }
  };
  async function get_cost_center() {
    try {
      let {
        data: { data },
      } = await getCostCenters();
      setCostCenter(data);
    } catch (err) {
      message.error(err?.error?.msg);
    }
  }

  async function getData() {
    setRowKeys([]);
    try {
      let {
        data: { data },
      } = await get_budgeting_List({year: selectYear});
      setData(data);
    } catch (err) {
      message.error(err?.error?.msg);
    }
    setLoading(false);
  }
  const columns = [
    {
      title: <span style={{ fontSize: 13 }}>COST CENTER</span>,
      columnTitle: "white",
      width: "50%",
      render: (current) =>
        costCenter?.find((item) => item.code === current.costcenter_code)?.name,
    },
    {
      title: <span style={{ fontSize: 13 }}>YEAR</span>,
      columnTitle: "white",
      width: "10%",
      render: (item) => item.year,
    },
    {
      title: <span style={{ fontSize: 13 }}>TOTAL BUDGET (USD)</span>,
      columnTitle: "white",
      width: "30%",
      render: (item) =>
        "$" + commonFilter("centToUsd", item.budget_amount_total),
    },
    {
      render: (item) => {
        const menu = (item) => (
          <Menu className="dropdown-button" style={{ width: 150 }}>
            <Menu.Item
              key="1"
              onClick={(e) => {
                e.domEvent.stopPropagation();
                AddBudgetRef.current.openAddBudget(item);
                setOpenType('Edit')
              }}
            >
              Edit
            </Menu.Item>
          </Menu>
        );
        // 此处显示权限：只要当前年份等于或者是未来年份才可以编辑，过去的年份不可编辑
        return (
          item.year >= defaultCurrentYear &&
          HasPermi(1005102) && (
            <Dropdown
              overlay={menu(item)}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Tooltip
                title={"More actions"}
                overlayStyle={{ whiteSpace: "nowrap" }}
              >
                <Button
                  onClick={(e) => e.stopPropagation()}
                  type="default"
                  className={`float-right blue margin-10-20-0-0`}
                  shape="circle"
                  icon={<MoreOutlined />}
                ></Button>
              </Tooltip>
            </Dropdown>
          )
        );
      },
    },
  ];
  const btnQuery = () => {
    setLoading(true);
    getData();
  };

  const operations = (
    <div className="bg-white flex-end height-60">
      <Select 
        style={{ width: 150 }} 
        defaultValue={defaultCurrentYear} 
        key={defaultCurrentYear}
        onChange={(v) => setSelectYear(v)}
      >
        {years?.map((item) => (
          <Select.Option key={item} value={item} label={`Year: ${item}`}>
            {`Year: ${item}`}
          </Select.Option>
        ))}
      </Select>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        className="margin-right-10 width-46"
        onClick={btnQuery}
      ></Button>
      {HasPermi(1005101) && (
        <Button
          className="blue margin-right-10"
          onClick={() =>{
            AddBudgetRef.current.openAddBudget()
            setOpenType('Add')
          }}
        >
          Add Budgeting
        </Button>
      )}
    </div>
  );
  const monthFun = (obj) => {
    let monthArr = [];
    months.forEach((month, i) => {
      obj?.budget_amount_monthly_s_?.forEach((amount, k) => {
        i === k &&
          monthArr.push({
            t: month,
            v: "$" + commonFilter("centToUsd", amount),
            position: 3,
          });
      });
    });
    return monthArr;
  };
  const allPage = (
    <div
      className="overflow-y-hidden overflow-x-hidden"
      style={{ marginTop: -5 }}
    >
      <Table
        className="margin-top-0 blue"
        columns={columns}
        dataSource={data}
        rowKey="id"
        expandRowByClick
        pagination={false}
        tableLayout="fixed"
        expandable={{
          expandedRowRender: (item) => (
            <>
              <MoreInformation
                title="MONTHLY BUDGET (USD)"
                objectArr={monthFun(item)}
                marginBottom
              />
              <MoreInformation
                objectArr={[
                  { t: "ID", v: item.id, position: 3 },
                  {
                    t: "Create Time",
                    v: commonFilter("fDate", item.create_time),
                    position: 3,
                  },
                  { t: "Admin", v: item.admin_name, position: 3 },
                  { t: "Remark", v: item.remark, position: 3 },
                ]}
              />
            </>
          ),
          expandedRowKeys: rowKeys,
          onExpandedRowsChange: (e) => setRowKeys(e),
        }}
      />
    </div>
  );
  return (
    <Spin spinning={loading}>
      <div className="default-font content-box bg-white">
        {operations}
        {allPage}
        <AddBudget type={openType} fresh={() => setFresh(!fresh)} ref={AddBudgetRef} costCenter={costCenter} />
      </div>
    </Spin>
  );
};

export default CreditBudgeting;

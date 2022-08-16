import React, { useState, useRef } from "react";
import { Button, Input, Select, Row, Col } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import DataTable from "./Table";
import "../wallet.css";

const { Search } = Input;
const { Option } = Select;

const Affiliate = () => {
  const [moreFilter, setMoreFilter] = useState(false);
  const [queryData, setQueryData] = useState({});
  const [searchType, setSearchType] = useState('1');
  const childTable = useRef(null);
  const getSearch = useRef(null);

  const search = (value) => {
    if (childTable.current && childTable) {
      childTable.current.search();
    }
    let temp = { [searchType === '1' ? 'referree' : 'referrer']: value };
    setQueryData(temp);
  };

  const operations = (
    <Row className="color-white search-bar" align="middle">
      <Col
        className="display-flex"
        span={24}
        style={{ justifyContent: "flex-end", alignItems:'center' }}
      >
        <Select
          style={{ width: "15%" }}
          defaultValue="1"
          onChange={(v) => setSearchType(v)}
        >
          <Option value="1" key="1">
            User ID
          </Option>
          <Option value="2" key="2">
            Affiliate Partner
          </Option>
        </Select>
        <Search
          className="width-250 margin-10-0"
          onSearch={(value) => search(value)}
          ref={getSearch}
          placeholder={`Search by ${searchType === '1' ? "'id/email" : "Partner'id/email"}`}
          enterButton
        />
        <Button
          type="default"
          className={`${
            moreFilter === true ? "more-filter-button margin-l-r-10" : ""
          } blue margin-0-10`}
          icon={<FilterOutlined />}
          onClick={() => setMoreFilter((moreFilter) => !moreFilter)}
        >
          More Filter
        </Button>
      </Col>
    </Row>
  );

  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      <DataTable
        params={queryData}
        update={() =>
          setQueryData({
            [searchType === '1' ? 'referree' : 'referrer']: getSearch.current && getSearch.current.state.value,
          })
        }
        ref={childTable}
        filterShow={moreFilter}
      />
    </div>
  );
};

export default Affiliate;

import React, { useState } from "react";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import DataTable from "./Table";

const TeacherConfig = () => {
  const [moreFilter, setMoreFilter] = useState(false);

  const operations = (
    <div className="color-white search-bar">
      <div className="float-right display-flex">
        <Button
          type="default"
          className={`${
            moreFilter === true ? "more-filter-button" : ""
          } blue margin-10-10-0-0`}
          icon={<FilterOutlined />}
          onClick={() => setMoreFilter((moreFilter) => !moreFilter)}
        >
          More Filter
        </Button>
      </div>
    </div>
  );

  return (
    <div className="default-font content-box bg-white font-size-9">
      {operations}
      <DataTable filterShow={moreFilter} />
    </div>
  );
};

export default TeacherConfig;

import React, { useState, useRef } from 'react';
import { Button, Input } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import DataTable from './Table';

const { Search } = Input;

const CreditHistory = () => {
    const [moreFilter, setMoreFilter] = useState(false);
    const [queryData, setQueryData] = useState({});
    const childTable = useRef(null);
    const getSearch = useRef(null);

    const search = (value) => {
        if (childTable.current && childTable) {
            childTable.current.search();
        }
        let temp = { 'order_id': value };
        setQueryData(temp)
    }
   
    const operations = (
        <div className="color-white search-bar">
            <div className="float-right display-flex">
                <Search
                    className="width-250 margin-10-0"
                    onSearch={(value) => search(value)}
                    ref={getSearch}
                    placeholder='Search by Order ID'
                    enterButton />
                <Button
                    type="default"
                    className={`${moreFilter === true ? 'more-filter-button' : ''} blue margin-10-10-0-10`}
                    icon={<FilterOutlined />}
                    onClick={() => setMoreFilter(moreFilter => !moreFilter)}>
                    More Filter
                </Button>
            </div>
        </div>
    )

    return (
        <div className="default-font content-box bg-white font-size-9">
            {operations}
            <DataTable
                params={queryData}
                update={() => setQueryData({ order_id: getSearch.current && getSearch.current.state.value })}
                ref={childTable}
                filterShow={moreFilter}
            />
        </div>
    )
}

export default CreditHistory;
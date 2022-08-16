 import React, { useState, useRef } from 'react';
import { Input } from 'antd';
import DataTable from './Table';

const { Search } = Input;

const BOSWallet = () => {
    const [queryData, setQueryData] = useState({});
    const childTable = useRef(null);
    const getSearch = useRef(null);

    const search = (value) => {
        if (childTable.current && childTable) {
            childTable.current.search();
        }
        let temp = { 'organiz_id': value };
        setQueryData(temp)
    }
   
    const operations = (
        <div className="color-white search-bar">
            <div className="float-right display-flex">
                <Search
                    className="width-250 margin-10-0 margin-right-10"
                    onSearch={(value) => search(value)}
                    ref={getSearch}
                    placeholder='BOS ID'
                    enterButton />
            </div>
        </div>
    )

    return (
        <div className="default-font content-box bg-white font-size-9">
            {operations}
            <DataTable params={queryData} ref={childTable} />
        </div>
    )
}

export default BOSWallet;
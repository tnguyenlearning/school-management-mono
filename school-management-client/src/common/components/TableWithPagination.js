import React from 'react';
import { Table, Pagination } from 'antd';

const TableWithPagination = ({ columns, data, pagination, loading, onTableChange }) => {
    return (
        <div>
            <Table columns={columns} dataSource={data} loading={loading} pagination={false} rowKey="id" onChange={onTableChange} />
            <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page, pageSize) => onTableChange({ current: page, pageSize })} // Ensure correct page and pageSize are passed
                onShowSizeChange={(current, size) => onTableChange({ current: 1, pageSize: size })} // Reset to page 1 when pageSize changes
                style={{ marginTop: '20px', textAlign: 'right' }}
            />
        </div>
    );
};

export default TableWithPagination;

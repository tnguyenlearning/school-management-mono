import { useState, useEffect } from 'react';
import { message } from 'antd';
import { searchPayments, searchReceipts } from '~/common/services/apis/studentAccountApis';
import { getInvoices } from '../services/apis/invoiceApis';
import { filterBillingCycles } from '../services/apis/billingApis';

const fetchFunctions = {
    searchPayments,
    searchReceipts,
    getInvoices,
    filterBillingCycles,
};

const useFetchData = ({ fetchFunction, additionalParams = {} }) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({});

    const fetchData = async (page = 0, pageSize, appliedFilters = filters) => {
        try {
            const { response, errorMessage } = await fetchFunctions[fetchFunction]({
                ...appliedFilters,
                page,
                size: pageSize,
                ...additionalParams,
            });
            if (errorMessage) {
                message.error(errorMessage);
            } else {
                setData(response.content);
                setPagination({ ...pagination, total: response.pageable.totalElements, current: page + 1 });
            }
        } catch (error) {
            message.error('Failed to fetch data. Please try again.');
        }
    };

    useEffect(() => {
        fetchData(pagination.current - 1, pagination.pageSize);
    }, [filters]);

    const handlePageChange = (page, pageSize) => {
        fetchData(page - 1, pageSize);
    };

    const handleFilterSubmit = (values) => {
        const formattedValues = {
            ...values,
            issueDate: values.issueDate ? [values.issueDate[0].format('YYYY-MM-DD'), values.issueDate[1].format('YYYY-MM-DD')] : undefined,
            dateRange: values.dateRange ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')] : undefined,
        };
        setFilters(formattedValues);
    };

    return { data, pagination, handlePageChange, handleFilterSubmit };
};

export default useFetchData;

import React, { useState } from 'react';
import ReceiptSearch from './ReceiptSearch';
import ReceiptTable from './ReceiptTable';
import ReceiptActions from './ReceiptActions';
import { fetchReceipts } from '~/common/services/apis/receiptApi';

const ReceiptMPage = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (filters) => {
        setLoading(true);
        const { response, errorMessage } = await fetchReceipts(filters);

        if (errorMessage) {
            console.error('Error fetching receipts:', errorMessage);
            // You can add a notification or alert here
            setReceipts([]);
        } else {
            setReceipts(response.content || []);
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Receipt Management</h1>
            <ReceiptActions />
            <ReceiptSearch onSearch={handleSearch} />
            <ReceiptTable data={receipts} loading={loading} />
        </div>
    );
};

export default ReceiptMPage;

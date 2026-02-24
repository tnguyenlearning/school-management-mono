import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReceiptActions = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/receipt/form/create')}>Create</button>
        </div>
    );
};

export default ReceiptActions;

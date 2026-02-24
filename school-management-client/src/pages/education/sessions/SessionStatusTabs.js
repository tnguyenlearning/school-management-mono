import { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { SessionStatus } from '~/common/constants/SessionStatus';
import { getSessionsByCourseId } from '~/common/services/apis/educations/classSessionApis';
import moment from 'moment';

const statusTabs = [{ key: 'ALL', label: 'All' }, ...SessionStatus.map((status) => ({ key: status, label: status.replace('_', ' ') }))];

const SessionStatusTabs = ({ courseId, renderTable, pageSize = 10 }) => {
    const [activeKey, setActiveKey] = useState('ALL');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize, total: 0 });
    const [sorter, setSorter] = useState({ field: 'sessionDate', order: null });

    useEffect(() => {
        fetchSessions();
        // eslint-disable-next-line
    }, [courseId, activeKey, pagination.current, pagination.pageSize, sorter]);

    const fetchSessions = async () => {
        setLoading(true);
        const params = {
            courseId,
            page: pagination.current - 1,
            size: pagination.pageSize,
        };
        if (sorter.order) params.sort = `${sorter.field},${sorter.order}`;
        if (activeKey !== 'ALL') params.status = activeKey;
        const { response, errorMessage } = await getSessionsByCourseId(params);
        if (response && response.content) {
            const updatedSessions = response.content.map((session) => ({
                ...session,
                adjustedStartTime: session.adjustedStartTime ? moment(session.adjustedStartTime, 'HH:mm:ss') : null,
                adjustedEndTime: session.adjustedEndTime ? moment(session.adjustedEndTime, 'HH:mm:ss') : null,
            }));
            setSessions(updatedSessions);
            setPagination((prev) => ({
                ...prev,
                total: response.totalElements || (response.pageable && response.pageable.totalElements) || 0,
                current: (response.number || 0) + 1,
            }));
        } else {
            message.error(errorMessage || 'Failed to load sessions.');
        }
        setLoading(false);
    };

    const handleTabChange = (key) => {
        setActiveKey(key);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handlePageChange = (page, pageSize) => {
        setPagination((prev) => ({ ...prev, current: page, pageSize }));
    };

    const handleTableChange = (paginationObj, filtersObj, sorterObj) => {
        let order = null;
        if (sorterObj && sorterObj.field === 'sessionDate') {
            if (sorter.order === null) {
                order = 'asc';
            } else if (sorter.order === 'asc') {
                order = 'desc';
            } else {
                order = null;
            }
            setSorter({ field: 'sessionDate', order });
        } else {
            setSorter({ field: 'sessionDate', order: null });
        }
    };

    // Expose refresh function for parent
    const refresh = () => fetchSessions();

    return (
        <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            items={statusTabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children: renderTable({
                    sessions,
                    loading,
                    pagination,
                    onPageChange: handlePageChange,
                    onTableChange: handleTableChange,
                    refresh,
                    activeStatus: activeKey,
                }),
            }))}
        />
    );
};

export default SessionStatusTabs;

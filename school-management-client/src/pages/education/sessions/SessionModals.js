import { Modal, Input, DatePicker, Select, TimePicker, Button } from 'antd';
import { SessionStatus } from '~/common/constants/SessionStatus';

const { Option } = Select;

export const RemarkModal = ({ visible, newRemark, onRemarkChange, onClose }) => (
    <Modal
        visible={visible}
        title="Remark"
        onCancel={onClose}
        footer={[
            <Button key="cancel" onClick={onClose}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onRemarkChange}>
                Submit
            </Button>,
        ]}
    >
        <Input.TextArea value={newRemark} onChange={(e) => onRemarkChange(e.target.value)} rows={4} placeholder="Enter remark" />
    </Modal>
);

export const TimeAdjustmentModal = ({ visible, adjustedStartTime, adjustedEndTime, onTimeChange, onClose }) => (
    <Modal
        visible={visible}
        title="Adjust Time"
        onCancel={onClose}
        footer={[
            <Button key="cancel" onClick={onClose}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onTimeChange}>
                Ok
            </Button>,
        ]}
    >
        <TimePicker value={adjustedStartTime} onChange={onTimeChange('start')} format="HH:mm:ss" placeholder="Start Time" />
        <TimePicker value={adjustedEndTime} onChange={onTimeChange('end')} format="HH:mm:ss" placeholder="End Time" />
    </Modal>
);

export const AddSessionModal = ({ visible, onClose, onAddSession, sessionData, onInputChange }) => (
    <Modal
        visible={visible}
        title="Add New Session"
        onCancel={onClose}
        footer={[
            <Button key="cancel" onClick={onClose}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onAddSession}>
                Add Session
            </Button>,
        ]}
    >
        <DatePicker value={sessionData.date} onChange={(date) => onInputChange('date', date)} format="YYYY-MM-DD" placeholder="Select Session Date" style={{ width: '100%', marginBottom: 16 }} />
        <Select value={sessionData.status} onChange={(status) => onInputChange('status', status)} style={{ width: '100%', marginBottom: 16 }} placeholder="Select Status">
            {SessionStatus.map((status) => (
                <Option key={status} value={status}>
                    {status}
                </Option>
            ))}
        </Select>
        <Input.TextArea value={sessionData.remark} onChange={(e) => onInputChange('remark', e.target.value)} placeholder="Enter Remark" rows={4} style={{ marginBottom: 16 }} />
        <TimePicker value={sessionData.startTime} onChange={(time) => onInputChange('startTime', time)} format="HH:mm:ss" placeholder="Start Time" style={{ width: '100%', marginBottom: 16 }} />
        <TimePicker value={sessionData.endTime} onChange={(time) => onInputChange('endTime', time)} format="HH:mm:ss" placeholder="End Time" style={{ width: '100%' }} />
    </Modal>
);

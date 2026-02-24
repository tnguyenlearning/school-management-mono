import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getCourseById, createCourse, updateCourse, deleteCourse } from '~/common/services/apis/courseApis';
import { reserveAutoNum, confirmAutoNum, reclaimAutoNum } from '~/common/services/apis/autonumApis';
import { AnumType } from '~/common/constants/app-enums';
import { getFrequencyOptions } from '~/common/services/apis/frequencyApis';
import urls from '~/common/configs/urls';
import { message, notification } from 'antd';
import { getAllowedFrequencyByCourseId } from '~/common/services/apis/courseAllowedFreqApis';

const useCourseForm = (action, courseId, form) => {
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [frequencyOptions, setFrequencyOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [autoNumber, setAutoNumber] = useState(null);

    useEffect(() => {
        setDisabled(action === 'enquiry' || action === 'delete');
        fetchFrequencyOptions();
        if (action === 'create') {
            getAndRemoveAnum();
        } else if (courseId) {
            fetchCourse(courseId);
        }
    }, [action, courseId]);

    useEffect(() => {
        if (course) {
            populateFormWithCourseData();
        } else {
            form.resetFields();
        }
    }, [course, form]);

    const getAndRemoveAnum = async () => {
        const { response, errorMessage } = await reserveAutoNum(AnumType.ENGLISH_COURSE);
        if (errorMessage) {
            showErrorNotification('Error Loading Course Code', errorMessage);
        } else {
            setAutoNumber(response);
            form.setFieldsValue({ code: response.number });
        }
    };

    const fetchCourse = async (id) => {
        setLoading(true);
        const { response, errorMessage } = await getCourseById(id);
        setLoading(false);
        if (response) {
            setCourse(response);
            form.setFieldsValue({
                ...response,
                startDate: moment(response.startDate),
                endDate: response.endDate ? moment(response.endDate) : null,
                startTime: moment(response.startTime, 'HH:mm:ss'),
                endTime: moment(response.endTime, 'HH:mm:ss'),
                daysOfWeek: response.daysOfWeek || [],
            });
            fetchAllowedFrequencyOptions(id); // Fetch allowed frequency options
        } else {
            message.error(errorMessage || 'Failed to load course.');
        }
    };

    const fetchAllowedFrequencyOptions = async (courseId) => {
        const { response, errorMessage } = await getAllowedFrequencyByCourseId(courseId);
        if (errorMessage) {
            showErrorNotification('Error Loading Allowed Frequency Options', errorMessage);
        } else {
            setSelectedOptions(response); // Set the selected options with the fetched allowed frequency options
        }
    };

    const fetchFrequencyOptions = async () => {
        const { response, errorMessage } = await getFrequencyOptions();
        if (errorMessage) {
            showErrorNotification('Error Loading Frequency Options', errorMessage);
        } else {
            console.log('setFrequencyOptions', response);
            setFrequencyOptions(response); // Set all available frequency options
        }
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        setLoading(true);
        const formattedValues = {
            course: {
                ...formatCourseValues(values),
                frequencyOptions: selectedOptions,
            },
            frequencyOptionIds: selectedOptions.map((option) => option.id),
        };
        let response, errorMessage;

        if (action === 'create') {
            ({ response, errorMessage } = await createCourse(formattedValues));
        } else if (action === 'edit') {
            ({ response, errorMessage } = await updateCourse(courseId, formattedValues));
        } else if (action === 'delete') {
            ({ response, errorMessage } = await deleteCourse(courseId));
        }

        setLoading(false);
        if (response) {
            message.success(`${capitalizeFirstLetter(action)} successful.`);
            navigate(urls.coursesMaintenance);
        } else {
            message.error(errorMessage || 'Action failed.');
        }
    };

    const formatCourseValues = (values) => ({
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        startTime: values.startTime.format('HH:mm:ss'),
        endTime: values.endTime.format('HH:mm:ss'),
    });

    const handleCancel = () => {
        if (action === 'create') {
            reclaimReservedNumber();
        }
        navigate(urls.coursesMaintenance);
    };

    const reclaimReservedNumber = async () => {
        if (autoNumber) {
            const { response, errorMessage } = await reclaimAutoNum(AnumType.ENGLISH_COURSE, autoNumber.number);
            if (errorMessage) {
                showErrorNotification('Error Reclaiming Course Code', errorMessage);
            }
        }
    };

    const showErrorNotification = (message, description) => {
        notification.error({
            message,
            description,
        });
    };

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const populateFormWithCourseData = () => {
        form.setFieldsValue({
            ...course,
            startDate: moment(course.startDate),
            endDate: course.endDate ? moment(course.endDate) : null,
            startTime: moment(course.startTime, 'HH:mm:ss'),
            endTime: moment(course.endTime, 'HH:mm:ss'),
            daysOfWeek: course.daysOfWeek || [],
        });
        //setFrequencyOptions(course.frequencyOptions || []);
    };

    return {
        course,
        frequencyOptions,
        selectedOptions,
        setSelectedOptions,
        loading,
        disabled,
        autoNumber,
        setFrequencyOptions,
        handleSubmit,
        handleCancel,
    };
};

export default useCourseForm;

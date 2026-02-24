import { useState, useEffect } from 'react';
import { getCourses } from '~/common/services/apis/courseApis';

function useCourses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            const { response, errorMessage } = await getCourses();
            if (errorMessage) {
                console.error('Failed to fetch courses:', errorMessage);
            } else {
                setCourses(response);
                setFilteredCourses(response);
            }
        };

        fetchCourses();
    }, []);

    const handleFilterChange = (text) => {
        setFilterText(text.toLowerCase());
        const filtered = courses.filter((course) => course.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCourses(filtered);
    };

    return { courses, filteredCourses, filterText, handleFilterChange };
}

export default useCourses;

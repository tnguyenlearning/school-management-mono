import { useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';
import { apiCallNoPage } from '~/common/services/apiService';
import useApi from '~/common/services/useApi';
function Home() {
    const navigate = useNavigate();
    const { data, loading, error, callAPI } = useApi();

    const fetchData = () => {
        fetch('http://localhost:8083/students', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
            .then((response) => {
                if (!response.ok) {
                    console.log('response ', response);
                }
                return response.json(); // Parse response as JSON
            })
            .then((data) => {
                console.log('Data:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // const fetchData = async () => {
    //     try {
    //         const responseData = await callap(urls.students, 'GET');
    //     } catch (error) {
    //         if (error.message.includes('Network error')) {
    //             navigate(urls.networkErr);
    //         } else {
    //             // do something
    //         }
    //     }
    // };
    return (
        <div>
            <button onClick={fetchData}>Fetch Data</button>
        </div>
    );
}

export default Home;

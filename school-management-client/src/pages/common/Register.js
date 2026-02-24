import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import urls from '../../common/configs/urls';
import { register } from '../../redux/actions/authActions';

function Register() {
    console.log('=====Render Register');
    const dispatch = useDispatch();
    const { isSuccess } = useSelector((state) => state.auth); // Access counter state

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [response, setResponse] = useState();
    const [error, setError] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // Dynamically update the formData state
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponse(null);
        setError(null);

        dispatch(register(formData))
            .then((response) => {
                setResponse(response);
            })
            .catch((error) => {
                if (error.message.includes('Network error')) {
                    navigate(urls.networkErr);
                } else {
                    setError(error.data.error_message);
                }
            });
    };

    const navigateToLogin = () => {
        navigate(urls.logIn);
    };

    return (
        <>
            {!response && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter First Name" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter Last Name" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="new-password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="new-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Enter Confirm Password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            )}

            {response && (
                <div>
                    <h1>Registration Successful!</h1>
                    <h3>First Name: {response.firstName}</h3>
                    <h3>Last Name: {response.lastName}</h3>
                    <h3>Email: {response.email}</h3>
                    <h3>Phone: {response.phone}</h3>
                    <h3>Roles:</h3>

                    {response.roles.map((role, index) => (
                        <li key={index}>{role.name}</li>
                    ))}
                    <Button variant="primary" onClick={navigateToLogin}>
                        Login
                    </Button>
                </div>
            )}
            {error && <p>Error: {error}</p>}
        </>
    );
}

export default Register;

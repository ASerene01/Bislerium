import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextInput from '../Common/TextInput';
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        email: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //if (formData.password !== formData.confirmPassword) {
        //    return Response.json({message: "password didnt match"})

        //}

        try {
            // Make a POST request to the registration endpoint
            const response = await axios.post('https://localhost:7274/api/Auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                password: formData.password,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                role: "Blogger"
            });
            console.log(response.status)
            // Check if registration was successful
            if (response.status === 201) {
                // Reset form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    userName: '',
                    password: '',
                    email: '',
                    phoneNumber: ''
                });
                // Show success message
                alert('Registration successful! You can now log in.');
                // Redirect to the login page
                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error(error.response);
            // Handle registration failure
            setError('Registration failed. Please try again later.');
        }
    };
    //const redirect = () = {
    //navigate('/login')}
    return (
        <div class="container-lg d-flex vh-100 align-items-center justify-content-center">
            <div class="card text-center main-card shadow-lg">
                <div class="card-header bg-first text-altbody login-title">
                    REGISTER
                </div>
                <div class="card-body">
                    <form onSubmit={handleSubmit}>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-envelope input-group-text"></i>
                            <TextInput
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                        </div>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-person input-group-text"></i>
                            <TextInput
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Username"
                            />
                        </div>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-envelope input-group-text"></i>
                            <TextInput
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone number"
                            />
                        </div>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-key input-group-text"></i>
                            <TextInput
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                            />
                        </div>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-key input-group-text"></i>
                            <TextInput
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
                            />
                        </div>
                        <div class="input-group my-3 px-5">
                            <i class="bi bi-key input-group-text"></i>
                            <TextInput
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </div>
                        {/*<div class="input-group my-3 px-5">*/}
                        {/*    <i class="bi bi-key input-group-text"></i>*/}
                        {/*    <TextInput*/}
                        {/*        type="text"*/}
                        {/*        name="confirmPassword"*/}
                        {/*        value={formData.confirmPassword}*/}
                        {/*        onChange={handleChange}*/}
                        {/*        placeholder="Password"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <button class="btn btn-third login-button my-3 text-first">
                            Register
                        </button>
                    </form>
                    <div class="mt-2 reset-text">
                        Already have an account? <Link to='/login' class="ml-2">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
        //<div className="auth-container">
        //    <h2>Register</h2>
        //    <hr/>
        //    {error && <div className="alert alert-danger">{error}</div>}
        //    <form onSubmit={handleSubmit}>
        //        <TextInput
        //            label="First Name"
        //            type="text"
        //            name="firstName"
        //            value={formData.firstName}
        //            onChange={handleChange}
        //        />
        //        <TextInput
        //            label="Last Name"
        //            type="text"
        //            name="lastName"
        //            value={formData.lastName}
        //            onChange={handleChange}
        //        />
        //        <TextInput
        //            label="Username"
        //            type="text"
        //            name="userName"
        //            value={formData.userName}
        //            onChange={handleChange}
        //        />
        //        <TextInput
        //            label="Email"
        //            type="email"
        //            name="email"
        //            value={formData.email}
        //            onChange={handleChange}
        //        />
        //        <TextInput
        //            label="Password"
        //            type="password"
        //            name="password"
        //            value={formData.password}
        //            onChange={handleChange}
        //        />
        //        <TextInput
        //            label="Phone Number"
        //            type="text"
        //            name="phoneNumber"
        //            value={formData.phoneNumber}
        //            onChange={handleChange}
        //        />
        //        <hr />
        //        <button type="submit" className="btn-auth py-3 mt-4">Register</button>
        //    </form>
        //</div>
    );
};

export default Register;

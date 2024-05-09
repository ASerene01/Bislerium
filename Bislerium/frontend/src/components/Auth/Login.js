import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import TextInput from '../Common/TextInput';
import { Link } from "react-router-dom";


const Login = () => {
    const [formData, setFormData] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("0-0-0-0-0-0-0-0-0-0-0-0-0")

        try {
            const response = await axios.post('https://localhost:7274/api/Auth/login', formData);
            console.log(response)

            if(response.data.token) {
                // Store the token in local storage
                localStorage.setItem('token', response.data.token);

                // Reset form data
                setFormData({ userName: '', password: '' });

                // Redirect to the home page or any other page upon successful login
                navigate('/');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div class="container-lg d-flex vh-100 align-items-center justify-content-center">
            <div class="card text-center main-card shadow-lg">
                <div class="card-header login-title">
                    LOGIN
                </div>
                <div class="card-body">
                    <form onSubmit={handleSubmit}>
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
                            <i class="bi bi-key input-group-text"></i>
                            <TextInput
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </div>
                        
                        <button type="submit" value="Login" className="btn login-button my-3">Login</button>
                    </form>
                    <div class="mt-2 reset-text">
                        <div>
                            Don't have an account? <Link to='/register' class="ml-2">Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        //<div className="auth-container">
        //    <h2>Login</h2>
        //    <hr />
        //    {error && <div className="alert alert-danger">{error}</div>}
        //    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        //        <div>
        //            <label>Username:</label>
        //            <TextInput
        //                type="text"
        //                name="userName"
        //                value={formData.userName}
        //                onChange={handleChange}
        //            />
        //        </div>
        //        <div>
        //            <label>Password:</label>
        //            <div className="password-input position-relative">
        //                <TextInput
        //                    type={showPassword ? 'text' : 'password'}
        //                    name="password"
        //                    value={formData.password}
        //                    onChange={handleChange}
        //                />
        //                <div className="d-flex mt-3">
        //                    <i
        //                        className={`password-toggle-icon ${showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}`}
        //                        onClick={togglePasswordVisibility}
        //                        style={{ cursor: 'pointer', font: 'Sans-Serif' }} // Change cursor to pointer on hover
        //                    ><p className="d-inline-block px-2" style={{ fontFamily:'monospace' }}>Show password</p></i>
        //                </div>
                        
        //            </div>
        //        </div>
        //        <hr />
        //        <button type="submit" className="py-3 btn-auth">Login</button>
        //    </form>
        //</div>
    );
};

export default Login;

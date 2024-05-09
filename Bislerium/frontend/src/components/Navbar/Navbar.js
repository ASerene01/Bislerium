import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // Import useAuth hook

const Navbar = () => {
    const { user, isLoggedIn, handleLogout } = useAuth(); // Use useAuth hook to access authentication context

    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                        <Link className="nav-link" to="/">Blogs</Link>
                        {isLoggedIn ? (<div><button class="nav-link" onclick={handleLogout()}>logout</button></div>) : (
                            <>
                                <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/Register">Sign up</Link></>
                        )}
                        
     
                    </div>
                </div>
            </div>
        </nav>
        //<nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        //    <div className="container">
        //        <Link className="navbar-brand" to="/"><i class="fa-solid fa-blog fa-bounce px-1"></i>Bislerium Blogs</Link>
        //        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        //            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        //            <span className="navbar-toggler-icon"></span>
        //        </button>
        //        <div className="collapse navbar-collapse" id="navbarNav">
        //            <ul className="navbar-nav mr-auto">
        //                <li className="nav-item">
        //                    <Link className="nav-link" to="/">Blogs</Link>
        //                </li>
        //                <li className="nav-item">
        //                    <Link className="nav-link" to="/about">About</Link>
        //                </li>
        //                <li className="nav-item">
        //                    <Link className="nav-link" to="/contact">Contact</Link>
        //                </li>
        //            </ul>
        //            <ul className="navbar-nav ml-auto">
        //                {isLoggedIn ? (
        //                    <li className="nav-item dropdown">
        //                        <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button"
        //                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //                            <i className="fa fa-user"></i> {user.exp} {/* Access user data from context */}
        //                        </a>
        //                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
        //                            <button className="dropdown-item" onClick={handleLogout}>Logout</button> {/* Use handleLogout from context */}
        //                        </div>
        //                    </li>
        //                ) : (
        //                    <>
        //                        <li className="nav-item">
        //                            <Link className="nav-link" to="/login">Login</Link>
        //                        </li>
        //                        <li className="nav-item">
        //                            <Link className="nav-link" to="/register">Signup</Link>
        //                        </li>
        //                    </>
        //                )}
        //            </ul>
        //        </div>
        //    </div>
        //</nav>
    );
};

export default Navbar;

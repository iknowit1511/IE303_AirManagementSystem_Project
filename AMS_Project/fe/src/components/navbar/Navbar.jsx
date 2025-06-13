import React, { useState, useEffect } from "react";
import { SiConsul } from "react-icons/si";
import { BsPhoneVibrate } from "react-icons/bs";
import { AiOutlineGlobal } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/apiService";

const Navbar = () => {
    const [active, setActive] = useState(false);
    const [navBarClass, setNavBarClass] = useState("navBarTwo");
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const location = useLocation(); // Hook để theo dõi đường dẫn hiện tại
    
    const toggleNavBar = () => setActive(!active);

    useEffect(() => {
        const handleScroll = () => {
            setNavBarClass(window.scrollY > 10 ? "navBarTwo navBarWithBg" : "navBarTwo");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Cuộn về đầu trang khi đường dẫn thay đổi
        window.scrollTo(0, 0);
    }, [location.pathname]); // Theo dõi sự thay đổi của đường dẫn

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout this user?")) {
            ApiService.logout();
            navigate("/");
        }
    };

    return (
        <div className="navBar flex">
            {/* Top Navbar */}
            <div className="navBarOne flex">
                <div>
                    <SiConsul className="icon" />
                </div>
                <div className="none flex">
                    <li className="flex">
                        <BsPhoneVibrate className="icon" />
                        <Link to="/help"> Support </Link>
                    </li>
             
                </div>
                <div className="atb flex">
                    {!isAuthenticated ? (
                        <>
                            <span>
                                <Link to="/sign-in">Sign In</Link>
                            </span>
                            <span>
                                <Link to="/sign-up">Sign Up</Link>
                            </span>
                        </>
                    ) : (
                        <>
                            {isUser && (
                                <span>
                                    <Link to="/profile">Profile</Link>
                                </span>
                            )}
                            {isAdmin && (
                                <span>
                                    <Link to="/admin">Admin</Link>
                                </span>
                            )}
                            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                                Logout
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Main Navbar */}
            <div className={navBarClass}>
                <div className="logoDiv">
                    <NavLink to="/">
                        <img src={logo} className="logo" alt="Logo" />
                    </NavLink>
                </div>

                <div className={`navBarMenu ${active ? "showNavBar" : ""}`}>
                    <ul className="menu flex">
                        <li className="listItem">
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li className="listItem">
                            <Link to='/search'>Search</Link>
                        </li>

                        <li className="listItem">
                            <Link to='/about'>About</Link>
                        </li>
                        <li className="listItem">
                            <Link to='/explore'>Explore</Link>
                        </li>
                        <li className="listItem">
                            <Link to='/map'>Map</Link>
                        </li>
                
                    </ul>
                    <button className="btn flex btnOne">Contact</button>
                </div>

                <button className="btn flex btnTwo">Contact</button>

                <div onClick={toggleNavBar} className="toggleIcon">
                    <CgMenuGridO className="icon" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
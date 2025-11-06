import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const logoUrl = "https://i.postimg.cc/ZqLLBhVx/Captura-de-pantalla-2025-11-01-224446.png";

    const handleLogoClick = () => {
        if (user?.rol === "reportero") {
            navigate("/panel-reportero");
        } else if (user?.rol === "editor") {
            navigate("/panel-editor");
        } else {
            navigate("/");
        }
    };

    return (
        <header className="header">
            <div className="header-left logo-link" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                <img src={logoUrl} alt="Logo InfoSphere" className="logo" />
                <h2>InfoSphere</h2>
            </div>

            <div className="header-right">
                {!user ? (
                    <>
                        <Link to="/login" className="btn-login">
                            Iniciar sesión
                        </Link>
                        <Link to="/register" className="btn-register">
                            Registrarse
                        </Link>
                    </>
                ) : (
                    <button className="btn-logout" onClick={logout}>
                        Cerrar sesión
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

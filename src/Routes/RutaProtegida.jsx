import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RutaProtegida = ({ children, rolPermitido }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (!user.rol) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Verificando acceso...</p>;
    }

    // ✅ Acepta string o array de roles
    const rolesPermitidos = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido];

    if (!rolesPermitidos.includes(user.rol)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RutaProtegida;

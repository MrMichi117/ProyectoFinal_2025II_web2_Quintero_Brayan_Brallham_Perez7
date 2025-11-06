import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("reportero");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // ✅ Crear el usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Guardar el rol y datos en Firestore
            await setDoc(doc(db, "users", user.uid), {
                email,
                role,
                createdAt: new Date(),
            });

            // ✅ Mostrar mensaje visual y redirigir según rol
            setUser({ ...user, rol: role }); // ✅ actualiza el contexto
            setSuccess("✅ Usuario registrado con éxito. Redirigiendo a tu panel...");

            setTimeout(() => {
                if (role === "reportero") {
                    navigate("/panel-reportero");
                } else if (role === "editor") {
                    navigate("/panel-editor");
                } else {
                    navigate("/");
                }
            }, 1500); // pequeño retraso para ver el mensaje
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("⚠️ Este correo ya está registrado. Intenta iniciar sesión.");
            } else if (err.code === "auth/invalid-email") {
                setError("❌ El correo electrónico no es válido.");
            } else if (err.code === "auth/weak-password") {
                setError("🔒 La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("❌ Ocurrió un error inesperado. Intenta nuevamente.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img
                    src="https://i.postimg.cc/ZqLLBhVx/Captura-de-pantalla-2025-11-01-224446.png"
                    alt="Logo InfoSphere"
                    className="auth-logo"
                />

                <h2>Registro de Usuario</h2>

                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="reportero">Reportero</option>
                        <option value="editor">Editor</option>
                    </select>
                    <button type="submit">Registrar</button>
                </form>

                <button className="btn-cancel" onClick={() => navigate("/")}>
                    Cancelar
                </button>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}

                <div className="auth-footer">
                    <p>
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="auth-link">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

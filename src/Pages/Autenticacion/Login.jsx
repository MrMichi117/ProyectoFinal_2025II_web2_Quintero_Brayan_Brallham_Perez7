import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setError("⚠️ Usuario sin perfil en la base de datos. Contacta al administrador.");
                return;
            }

            const role = docSnap.data().role;
            setUser({ ...user, rol: role }); // ✅ corregido: usar "rol"

            alert("✅ Sesión iniciada correctamente");

            if (role === "reportero") {
                navigate("/panel-reportero");
                return;
            } else if (role === "editor") {
                navigate("/panel-editor");
                return;
            } else {
                setError("⚠️ Rol no reconocido. Contacta al administrador.");
            }

        } catch (err) {
            setError("❌ Credenciales incorrectas o usuario no existe");
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

                <h2>Iniciar Sesión</h2>

                <form onSubmit={handleLogin}>
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
                    <button type="submit">Entrar</button>
                </form>

                <button className="btn-cancel" onClick={() => navigate("/")}>
                    Cancelar
                </button>

                {error && <p className="auth-error">{error}</p>}

                <div className="auth-footer">
                    <p>
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="auth-link">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

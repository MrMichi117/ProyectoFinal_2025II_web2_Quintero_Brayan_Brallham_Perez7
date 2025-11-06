import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PanelReportero.css";

const PanelReportero = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerNoticias = async () => {
            const q = query(collection(db, "noticias"), where("autor", "==", user.email));
            const snapshot = await getDocs(q);
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNoticias(lista);
            setCargando(false);
        };
        obtenerNoticias();
    }, [user]);

    const marcarComoTerminada = async (id) => {
        const docRef = doc(db, "noticias", id);
        await updateDoc(docRef, {
            estado: "Terminado",
            fechaActualizacion: new Date(),
        });
        const q = query(collection(db, "noticias"), where("autor", "==", user.email));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNoticias(lista);
    };

    if (cargando) return <p style={{ textAlign: "center" }}>⏳ Cargando tus noticias...</p>;

    return (
        <div className="reportero-container">
            <div className="reportero-header">
                <h2>📰 Panel del Reportero</h2>
                <p>Bienvenido, <strong>{user.email}</strong></p>
                <button onClick={() => navigate("/")}>🏠 Ir al Inicio</button>
                <button onClick={() => navigate("/crear-noticia")}>➕ Crear Noticia</button>
            </div>

            <div className="noticias-listado">
                {noticias.length === 0 ? (
                    <p>No tienes noticias aún. ¡Crea la primera!</p>
                ) : (
                    noticias.map((noticia) => (
                        <div key={noticia.id} className="noticia-card">
                            <h3>{noticia.titulo}</h3>
                            <div className="imagen-contenedor">
                                <img
                                    src={noticia.imagen}
                                    alt="Imagen de la noticia"
                                    className="imagen-noticia"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x200.png?text=Imagen+no+disponible";
                                    }}
                                />
                            </div>
                            <p><strong>Estado:</strong> {noticia.estado}</p>
                            <p><strong>Categoría:</strong> {noticia.seccion}</p>
                            <button onClick={() => navigate(`/editar-noticia/${noticia.id}`)}>✏️ Editar</button>
                            {noticia.estado === "Edición" && (
                                <button onClick={() => marcarComoTerminada(noticia.id)}>✅ Marcar como Terminada</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PanelReportero;

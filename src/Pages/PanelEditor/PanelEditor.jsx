import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PanelEditor.css";

const PanelEditor = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);

    const resumenEstados = noticias.reduce((acc, noticia) => {
        acc[noticia.estado] = (acc[noticia.estado] || 0) + 1;
        return acc;
    }, {});

    const obtenerNoticias = async () => {
        const snapshot = await getDocs(collection(db, "noticias"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNoticias(lista);
        setCargando(false);
    };

    useEffect(() => {
        if (!user) return;

        if (user?.rol !== "editor") {
            navigate("/");
            return;
        }

        obtenerNoticias();
    }, []);

    const actualizarEstado = async (id, nuevoEstado) => {
        const docRef = doc(db, "noticias", id);
        await updateDoc(docRef, {
            estado: nuevoEstado,
            fechaActualizacion: new Date(),
        });
        obtenerNoticias();
    };

    const eliminarNoticia = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta noticia?");
        if (!confirmar) return;

        await deleteDoc(doc(db, "noticias", id));
        obtenerNoticias();
    };

    if (cargando) return <p style={{ textAlign: "center" }}>⏳ Cargando noticias...</p>;

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h2>🗞️ Panel del Editor</h2>
                <p><strong>Editor:</strong> {user?.email}</p>
                <div className="resumen-estados">
                    <p><strong>Resumen:</strong></p>
                    <ul>
                        <li>📝 Terminado: {resumenEstados["Terminado"] || 0}</li>
                        <li>✅ Publicado: {resumenEstados["Publicado"] || 0}</li>
                        <li>🚫 Desactivado: {resumenEstados["Desactivado"] || 0}</li>
                    </ul>
                </div>

                <div className="botones-header">
                    <button onClick={() => navigate("/")}>🏠 Ir al Inicio</button>
                    <button onClick={() => navigate("/gestionar-secciones")}>🗂️ Gestionar Secciones</button>
                </div>
            </div>

            <div className="noticias-listado">
                {noticias.length === 0 ? (
                    <p>No hay noticias disponibles.</p>
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
                            <p><strong>Autor:</strong> {noticia.autor}</p>
                            <p><strong>Estado:</strong> {noticia.estado}</p>
                            <p><strong>Categoría:</strong> {noticia.seccion}</p>

                            <button className="btn-editar" onClick={() => navigate(`/editar-noticia/${noticia.id}`)}>✏️ Editar</button>

                            {noticia.estado === "Terminado" && (
                                <button className="btn-publicar" onClick={() => actualizarEstado(noticia.id, "Publicado")}>✅ Publicar</button>
                            )}

                            {noticia.estado === "Publicado" && (
                                <button className="btn-publicar" onClick={() => actualizarEstado(noticia.id, "Desactivado")}>🚫 Desactivar</button>
                            )}

                            {noticia.estado === "Desactivado" && (
                                <button className="btn-publicar" onClick={() => actualizarEstado(noticia.id, "Publicado")}>🔁 Re-publicar</button>
                            )}

                            <button className="btn-eliminar" onClick={() => eliminarNoticia(noticia.id)}>🗑️ Eliminar</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PanelEditor;

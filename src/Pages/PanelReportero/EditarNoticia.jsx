import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    collection,
    getDocs,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EditarNoticia.css";

const EditarNoticia = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [noticia, setNoticia] = useState(null);
    const [secciones, setSecciones] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!user) return;

        const rolesPermitidos = ["reportero", "editor"];
        if (!rolesPermitidos.includes(user.rol)) {
            navigate("/");
            return;
        }

        const cargarNoticia = async () => {
            const docRef = doc(db, "noticias", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setNoticia(docSnap.data());
            }
            setCargando(false);
        };

        const cargarSecciones = async () => {
            const snapshot = await getDocs(collection(db, "secciones"));
            const lista = snapshot.docs.map((doc) => doc.data().nombre);
            setSecciones(lista);
        };

        cargarNoticia();
        cargarSecciones();
    }, [id, user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMensaje("⏳ Actualizando noticia...");

        try {
            const docRef = doc(db, "noticias", id);
            await updateDoc(docRef, {
                ...noticia,
                fechaActualizacion: serverTimestamp(),
            });
            setMensaje("✅ Noticia actualizada.");
            const destino = user?.rol === "editor" ? "/panel-editor" : "/panel-reportero";
            setTimeout(() => navigate(destino), 1500);
        } catch (error) {
            console.error(error);
            setMensaje("❌ Error al actualizar.");
        }
    };

    if (!user) return <p style={{ textAlign: "center" }}>⏳ Cargando sesión...</p>;
    if (cargando) return <p style={{ textAlign: "center" }}>⏳ Cargando noticia...</p>;
    if (!noticia) return <p style={{ textAlign: "center" }}>❌ Noticia no encontrada.</p>;

    const destinoCancelar = user?.rol === "editor" ? "/panel-editor" : "/panel-reportero";

    return (
        <div className="editar-container">
            <h2>✏️ Editar Noticia</h2>
            <form onSubmit={handleUpdate} className="editar-form">
                <input
                    type="text"
                    value={noticia.titulo}
                    onChange={(e) => setNoticia({ ...noticia, titulo: e.target.value })}
                    required
                />
                <input
                    type="text"
                    value={noticia.subtitulo}
                    onChange={(e) => setNoticia({ ...noticia, subtitulo: e.target.value })}
                />
                <textarea
                    value={noticia.contenido}
                    onChange={(e) => setNoticia({ ...noticia, contenido: e.target.value })}
                    required
                />
                <select
                    value={noticia.categoria}
                    onChange={(e) => setNoticia({ ...noticia, categoria: e.target.value })}
                    required
                >
                    <option value="">-- Selecciona una categoría --</option>
                    {secciones.map((nombre, index) => (
                        <option key={index} value={nombre}>
                            {nombre}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={noticia.imagen}
                    onChange={(e) => setNoticia({ ...noticia, imagen: e.target.value })}
                />
                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={() => navigate(destinoCancelar)}>
                    Cancelar
                </button>
            </form>
            {mensaje && <p className="editar-status">{mensaje}</p>}
        </div>
    );
};

export default EditarNoticia;

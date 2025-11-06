import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CrearNoticia.css";

const CrearNoticia = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [seccion, setSeccion] = useState("");
    const [secciones, setSecciones] = useState([]);
    const [imagen, setImagen] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const obtenerSecciones = async () => {
            const snapshot = await getDocs(collection(db, "secciones"));
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSecciones(lista);
        };
        obtenerSecciones();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje("⏳ Guardando noticia...");

        const imagenUrl = imagen?.trim() || "https://via.placeholder.com/400x200.png?text=Sin+imagen";

        try {
            await addDoc(collection(db, "noticias"), {
                titulo,
                subtitulo,
                contenido,
                seccion,
                imagen: imagenUrl,
                autor: user.email,
                fechaCreacion: serverTimestamp(),
                fechaActualizacion: serverTimestamp(),
                estado: "Edición",
            });

            setMensaje("✅ Noticia creada correctamente.");
            setTimeout(() => navigate("/panel-reportero"), 1500);
        } catch (error) {
            console.error(error);
            setMensaje("❌ Error al crear la noticia.");
        }

        setCargando(false);
    };

    return (
        <div className="crear-container">
            <h2>📝 Crear Nueva Noticia</h2>
            <form onSubmit={handleSubmit} className="crear-form">
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Subtítulo"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                />
                <textarea
                    placeholder="Contenido..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />
                <select
                    value={seccion}
                    onChange={(e) => setSeccion(e.target.value)}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {secciones.map(sec => (
                        <option key={sec.id} value={sec.nombre}>{sec.nombre}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                />
                <button type="submit" disabled={cargando}>
                    {cargando ? "Guardando..." : "Crear Noticia"}
                </button>
                <button type="button" onClick={() => navigate("/panel-reportero")}>
                    Cancelar
                </button>
            </form>
            {mensaje && <p className="crear-status">{mensaje}</p>}
        </div>
    );
};

export default CrearNoticia;

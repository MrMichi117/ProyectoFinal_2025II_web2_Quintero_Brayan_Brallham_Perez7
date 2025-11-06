import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    writeBatch,
    Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./GestionSecciones.css";

const GestionSecciones = () => {
    const [secciones, setSecciones] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idActual, setIdActual] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const normalizarTexto = (texto) => {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const obtenerSecciones = async () => {
        const snapshot = await getDocs(collection(db, "secciones"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSecciones(lista);
    };

    useEffect(() => {
        obtenerSecciones();
    }, []);

    const crearSeccion = async () => {
        if (!nombre.trim()) return;

        const nombreNormalizado = normalizarTexto(nombre);
        const existe = secciones.some(
            (sec) => normalizarTexto(sec.nombre) === nombreNormalizado
        );

        if (existe) {
            setError(`La sección "${nombre}" ya existe.`);
            setMensaje("");
            return;
        }

        await addDoc(collection(db, "secciones"), {
            nombre,
            descripcion,
            estado: "activa",
            fechaCreacion: Timestamp.now(),
        });

        setNombre("");
        setDescripcion("");
        setMensaje(`Sección "${nombre}" creada correctamente.`);
        setError("");
        obtenerSecciones();
    };

    const editarSeccion = (seccion) => {
        setModoEdicion(true);
        setIdActual(seccion.id);
        setNombre(seccion.nombre);
        setDescripcion(seccion.descripcion);
    };

    const guardarEdicion = async () => {
        if (!nombre.trim()) return;

        const nombreNormalizado = normalizarTexto(nombre);
        const existe = secciones.some(
            (sec) => normalizarTexto(sec.nombre) === nombreNormalizado && sec.id !== idActual
        );

        if (existe) {
            setError(`Ya existe otra sección con el nombre "${nombre}".`);
            setMensaje("");
            return;
        }

        const ref = doc(db, "secciones", idActual);
        await updateDoc(ref, {
            nombre,
            descripcion,
        });

        setModoEdicion(false);
        setIdActual(null);
        setNombre("");
        setDescripcion("");
        setMensaje(`Sección "${nombre}" actualizada correctamente.`);
        setError("");
        obtenerSecciones();
    };

    const eliminarSeccion = async (id) => {
        const seccion = secciones.find((s) => s.id === id);
        if (!seccion) return;

        const confirmar = window.confirm(
            `¿Eliminar la sección "${seccion.nombre}" y todas sus noticias asociadas?`
        );
        if (!confirmar) return;

        try {
            // 1. Eliminar noticias asociadas
            const noticiasQuery = query(
                collection(db, "noticias"),
                where("seccion", "==", seccion.nombre)
            );
            const snapshot = await getDocs(noticiasQuery);

            const batch = writeBatch(db);
            snapshot.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();

            // 2. Eliminar la sección
            await deleteDoc(doc(db, "secciones", id));

            setMensaje(`Sección "${seccion.nombre}" y ${snapshot.size} noticias eliminadas.`);
            obtenerSecciones();
        } catch (error) {
            console.error("Error al eliminar sección y noticias:", error);
            setError("❌ Ocurrió un error al eliminar la sección.");
        }
    };

    useEffect(() => {
        if (mensaje || error) {
            const timer = setTimeout(() => {
                setMensaje("");
                setError("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [mensaje, error]);

    return (
        <div className="secciones-container">
            <button className="volver-btn" onClick={() => navigate("/panel-editor")}>
                ← Volver al Panel del Editor
            </button>

            <h2>🗂️ Gestión de Secciones</h2>
            {mensaje && <p className="mensaje-ok">{mensaje}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            <div className="formulario-seccion">
                <input
                    type="text"
                    placeholder="Nombre de la sección"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                {modoEdicion ? (
                    <button onClick={guardarEdicion}>💾 Guardar cambios</button>
                ) : (
                    <button onClick={crearSeccion}>➕ Crear sección</button>
                )}
            </div>

            <div className="lista-secciones">
                {secciones.length === 0 ? (
                    <p>No hay secciones registradas.</p>
                ) : (
                    secciones.map((sec) => (
                        <div key={sec.id} className="seccion-card">
                            <h3>{sec.nombre}</h3>
                            <p>{sec.descripcion}</p>
                            <div className="acciones">
                                <button onClick={() => editarSeccion(sec)}>✏️ Editar</button>
                                <button onClick={() => eliminarSeccion(sec.id)}>🗑️ Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GestionSecciones;

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../Firebase/ConfigFirebase";
import { useAuth } from "../../context/AuthContext";
import "./InicioPublico.css";

const InicioPublico = () => {
    const [secciones, setSecciones] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ultimaNoticia, setUltimaNoticia] = useState(null);
    const [hayMas, setHayMas] = useState(true);
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(false);


    const irAlPanel = () => {
        if (!user) return;
        if (user.rol === "reportero") {
            navigate("/panel-reportero");
        } else if (user.rol === "editor") {
            navigate("/panel-editor");
        }
    };

    const cargarNoticias = async () => {
        setCargando(true);

        const q = query(
            collection(db, "noticias"),
            orderBy("fechaCreacion", "desc")
        );

        const snapshot = await getDocs(q);
        const todas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setNoticias(todas);
        setCargando(false);
    };


    useEffect(() => {
        const cargarSecciones = async () => {
            const snapshot = await getDocs(collection(db, "secciones"));
            const lista = snapshot.docs.map(doc => doc.data().nombre);
            setSecciones(lista);
        };
        cargarSecciones();
        cargarNoticias();
    }, []);



    return (
        <div className="inicio-publico">
            {user && (
                <button onClick={irAlPanel}>
                    🎯 Ir a mi Panel
                </button>
            )}
            <h2>📰 Noticias por Sección</h2>
            <div className="secciones-listado">
                {secciones.map((nombre, index) => (
                    <Link key={index} to={`/seccion/${nombre}`} className="seccion-card">
                        {nombre}
                    </Link>
                ))}
            </div>
            <h3>🗞️ Todas las Noticias</h3>
            <div className="noticias-listado">
                {noticias.map(noticia => (
                    <div key={noticia.id} className="noticia-card">
                        <h3>{noticia.titulo}</h3>
                        {noticia.imagen && (
                            <img src={noticia.imagen} alt="Imagen" className="imagen-miniatura" />
                        )}
                        <p>{noticia.subtitulo}</p>
                        <Link to={`/noticia/${noticia.id}`} className="leer-mas">📖 Leer más</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InicioPublico;

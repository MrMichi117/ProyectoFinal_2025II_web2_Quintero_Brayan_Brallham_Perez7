import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/ConfigFirebase";
import "./SeccionNoticias.css";

const SeccionNoticias = () => {
    const { nombre } = useParams();
    const [noticias, setNoticias] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarNoticias = async () => {
            const q = query(
                collection(db, "noticias"),
                where("estado", "==", "Publicado"),
                where("seccion", "==", nombre)
            );
            const snapshot = await getDocs(q);
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (lista.length === 0) {
                setMensaje("⚠️ No hay noticias publicadas en esta sección.");
            } else {
                setNoticias(lista);
            }
        };
        cargarNoticias();
    }, [nombre]);

    return (
            <div className="seccion-container">
            <button className="volver-inicio1" onClick={() => navigate("/")}>
                Inicio
            </button>

            <h2>🗂️ Sección: {nombre}</h2>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <div className="noticias-listado">
                {noticias.map(noticia => (
                    <div key={noticia.id} className="noticia-card">
                        <h3>{noticia.titulo}</h3>
                        <img src={noticia.imagen} alt="Imagen" className="imagen-miniatura" />
                        <p>{noticia.subtitulo}</p>
                        <Link to={`/noticia/${noticia.id}`} className="leer-mas">📖 Leer más</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeccionNoticias;

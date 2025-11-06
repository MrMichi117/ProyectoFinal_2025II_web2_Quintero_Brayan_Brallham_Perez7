import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/ConfigFirebase";
import "./NoticiaPublica.css";

const NoticiaPublica = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarNoticia = async () => {
            const docRef = doc(db, "noticias", id);
            const docSnap = await getDoc(docRef);
            

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.estado === "Publicado") {
                    setNoticia({ ...data, id: docSnap.id });
                } else {
                    setMensaje("⚠️ Esta noticia no está publicada.");
                }
            } else {
                setMensaje("❌ Noticia no encontrada.");
            }
        };
        cargarNoticia();
    }, [id]);

    if (mensaje) return <p className="mensaje">{mensaje}</p>;
    if (!noticia) return <p className="mensaje">⏳ Cargando noticia...</p>;

    return (
        <div className="noticia-publica">
            <h2>{noticia.titulo}</h2>
            <h4>{noticia.subtitulo}</h4>
            {noticia.imagen && (
                <img src={noticia.imagen} alt="Imagen de la noticia" className="imagen-noticia" />
            )}
            <p className="contenido">{noticia.contenido}</p>
            <div className="info-extra">
                <p><strong>Autor:</strong> {noticia.autor}</p>
                <p><strong>Sección:</strong> {noticia.seccion}</p>
                <p><strong>Fecha:</strong> {new Date(noticia.fechaCreacion?.seconds * 1000).toLocaleDateString()}</p>
            </div>
            <button className="volver-seccion" onClick={() => navigate(`/seccion/${noticia.seccion}`)}>
                Volver: {noticia.seccion}
            </button>
        </div>
    );
};

export default NoticiaPublica;

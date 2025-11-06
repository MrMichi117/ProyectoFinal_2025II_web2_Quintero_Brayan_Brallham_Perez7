import { Routes, Route } from "react-router-dom";
import HeaderWrapper from "./Components/Header/HeaderWrapper"; // nuevo componente para manejar el header
import Login from "./Pages/Autenticacion/Login";
import Register from "./Pages/Autenticacion/Register";
import PanelReportero from "./Pages/PanelReportero/PanelReportero";
import CrearNoticia from "./Pages/PanelReportero/CrearNoticia";
import EditarNoticia from "./Pages/PanelReportero/EditarNoticia";
import PanelEditor from "./Pages/PanelEditor/PanelEditor";
import GestionSecciones from "./Pages/PanelEditor/GestionSecciones";
import RutaProtegida from "./Routes/RutaProtegida";
import InicioPublico from "./Pages/Publico/InicioPublico";
import SeccionNoticias from "./Pages/Publico/SeccionNoticias";
import NoticiaPublica from "./Pages/Publico/NoticiaPublica";
import "./App.css";

function App() {
  return (
    <>
      {/* Header condicional */}
      <HeaderWrapper />

      {/* Rutas de la app */}
      <Routes>
        <Route path="/" element={<InicioPublico />} />
        <Route path="/seccion/:nombre" element={<SeccionNoticias />} />
        <Route path="/noticia/:id" element={<NoticiaPublica />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/panel-reportero"
          element={
            <RutaProtegida rolPermitido="reportero">
              <PanelReportero />
            </RutaProtegida>
          }
        />
        <Route
          path="/crear-noticia"
          element={
            <RutaProtegida rolPermitido="reportero">
              <CrearNoticia />
            </RutaProtegida>
          }
        />
        <Route
          path="/editar-noticia/:id"
          element={
            <RutaProtegida rolPermitido={["reportero", "editor"]}>
              <EditarNoticia />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel-editor"
          element={
            <RutaProtegida rolPermitido="editor">
              <PanelEditor />
            </RutaProtegida>
          }
        />
        <Route
          path="/gestionar-secciones"
          element={
            <RutaProtegida rolPermitido="editor">
              <GestionSecciones />
            </RutaProtegida>
          }
        />

      </Routes>
    </>
  );
}

export default App;

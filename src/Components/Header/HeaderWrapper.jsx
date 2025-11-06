import { useLocation } from "react-router-dom";
import Header from "./Header";

const HeaderWrapper = () => {
    const location = useLocation();

    // Oculta header en login y register
    if (location.pathname === "/login" || location.pathname === "/register") return null;

    return <Header />;
};

export default HeaderWrapper;

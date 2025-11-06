import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/ConfigFirebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const role = docSnap.data().role;
                        setUser({ ...currentUser, rol: role }); // ✅ guardamos como "rol"
                    } else {
                        console.warn("⚠️ Usuario sin documento en Firestore");
                        setUser({ ...currentUser, rol: null });
                    }
                } catch (error) {
                    console.error("❌ Error al obtener rol:", error);
                    setUser({ ...currentUser, rol: null });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>⏳ Cargando sesión...</p>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

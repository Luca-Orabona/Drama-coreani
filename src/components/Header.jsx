import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Heart, Scale, Sparkles, House } from "lucide-react";
import { useDramaContext } from "../context/dramaContext";
import useFilterParams from "../hooks/useFilterParams";
import styles from "./Header.module.css";

const Header = () => {

    // Gestisce l’apertura e chiusura del menu mobile
    const [menuOpen, setMenuOpen] = useState(false);

    // Dati provenienti dal contesto (lista preferiti)
    const { favorites, lastParamsRef } = useDramaContext();

    // Funzione che mostra/nasconde il menu mobile
    const toggleMenu = () => setMenuOpen(prev => !prev);

   

    return (
        <header className={styles.header}>
            {/* LOGO */}
            <NavLink to="/" className={styles.logo}>
                <h1>Kdrama Italy</h1>
            </NavLink>

            {/* NAVBAR — Link principali */}
            <nav className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ""}`}>

                {/* Home */}
                <NavLink
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => isActive ? styles.activeLink : undefined}
                >
                    <House size={18} style={{ marginRight: "6px" }} />
                    Home
                </NavLink>


                {/* Lista Drama */}
                <NavLink
                    to={`/dramalist?${lastParamsRef.current}`}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => isActive ? styles.activeLink : undefined}
                >
                    <Sparkles size={18} style={{ marginRight: "6px" }} />
                    Drama
                </NavLink>

                {/* 🔹 Preferiti (con badge numerico) */}
                <NavLink
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => isActive ? styles.activeLink : undefined}
                >
                    <Heart size={18} style={{ marginRight: "6px" }} />
                    <span>Preferiti</span>
                    {/* Mostra badge solo se ci sono preferiti */}
                    {favorites.length > 0 && (
                        <span className={styles.favoritesBadge}>
                            {favorites.length}
                        </span>
                    )}
                </NavLink>

                {/* Confronto Drama */}
                <NavLink
                    to="/confronto-drama"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => isActive ? styles.activeLink : undefined}
                >
                    <Scale size={18} style={{ marginRight: "6px" }} />
                    Confronta
                </NavLink>
            </nav>

            {/* MENU TOGGLE — Icona hamburger (mobile) */}
            <div className={styles.menuToggle} onClick={toggleMenu}>
                {menuOpen ? (
                    <X size={30} color="#fff" strokeWidth={2.5} />
                ) : (
                    <Menu size={30} color="#fff" strokeWidth={2.5} />
                )}
            </div>

            {/* OVERLAY */}
            {menuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
        </header>
    );
};

export default Header;
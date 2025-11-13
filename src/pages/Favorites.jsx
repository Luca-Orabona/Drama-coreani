import { useDramaContext } from "../context/dramaContext";
import DramaCard from "../components/DramaCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Favorites.module.css";

const Favorites = () => {
  const { favorites, setFavorites } = useDramaContext();

  return (
    <section className={styles.favoritesPage}>

      {/* header */}
      <div className={styles.header}>

        <div className={styles.icon}>
          <Heart size={40} fill="#fff" stroke="none" />
        </div>

        <h1 className={styles.title}>I Miei Preferiti</h1>

        {favorites.length > 0 && <button className={styles.deleteBtn} onClick={() => setFavorites([])}>Elimina tutti</button>}

        <p className={styles.count}>{favorites.length} drama salvati</p>

      </div>



      {/* se lista vuota */}
      {favorites.length === 0 ? (

        <div className={styles.favoritesEmpty}>

          <div className={styles.emptyIcon}>
            <Heart size={60} strokeWidth={2.5} />
          </div>

          <h2 className={styles.emptyTitle}>Nessun Preferito</h2>

          <p className={styles.emptyText}>
            Non hai ancora aggiunto nessun drama ai preferiti. Inizia ad
            esplorare e salva i tuoi preferiti!
          </p>

          <Link to="/dramaList" className={styles.exploreBtn}>
            Esplora Drama
          </Link>

        </div>

      ) : (

        /* griglia delle card */
        <div className={styles.favoritesGrid}>

          {favorites.map((drama) => (
            <div key={drama.id} className={styles.col}>
              <DramaCard drama={drama} />
            </div>
          ))}

        </div>

      )}
    </section>
  );
};

export default Favorites;

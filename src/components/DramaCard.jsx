import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Link2 } from "lucide-react";
import { useDramaContext } from "../context/dramaContext";
import { toast } from 'react-toastify';
import styles from "./DramaCard.module.css";

const { VITE_API_URL } = import.meta.env;


const DramaCard = memo(({ drama }) => {
  const { favorites, toggleFavorite } = useDramaContext();
  const isFavorite = favorites.some((fav) => fav.id === drama.id);

  return (
    <div className={styles.dramaCard}>

      <div className={styles.imageWrapper}>
        <img
          src={`${VITE_API_URL}/${drama.coverImage}`}
          alt={drama.title}
          className={styles.image}
        />

        {/* --- icone --- */}
        <div className={styles.cardIcons}>
          {/* ❤️ Preferiti */}
          <button
            className={`${styles.iconBtn} ${isFavorite ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();

              if (isFavorite) {
                toast("Rimosso dai preferiti!", {
                  icon: () => <span style={{ fontSize: "18px" }}>💔</span>,
                  type: "error"
                });
              } else {
                toast("Aggiunto ai preferiti!", {
                  icon: () => <span style={{ fontSize: "18px" }}>❤️</span>,
                  type: "success"
                });
              }

              toggleFavorite(drama);
            }}


            // 👇 Tooltip dinamico
            data-label={
              isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
            }
          >
            <Heart size={18} />
          </button>

          {/* 🔗 Dettagli */}
          <NavLink
            to={`/dramaDetails/${drama.id}`}
            className={styles.iconBtn}
            data-label="Dettagli"
          >
            <Link2 size={18} />
          </NavLink>
        </div>
      </div>

      {/* --- testo --- */}
      <div className={styles.info}>
        <h3>{drama.title}</h3>
        <span className={styles.category}>{drama.category}</span>
        <p>Una breve descrizione</p>
      </div>

    </div>
  );
});

export default DramaCard;

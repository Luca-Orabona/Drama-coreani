import { useParams, NavLink } from "react-router-dom";
import { useDramaContext } from "../context/dramaContext";
import { ArrowLeft, Heart, Video, Calendar, Tv, UserRound, Star } from "lucide-react";
import styles from "./DramaDetails.module.css";

function DramaDetails() {
  const { id } = useParams();
  const { getDramaById, toggleFavorite, favorites } = useDramaContext();
  const drama = getDramaById(id);

  if (!drama) {
    return <p className={styles.notFound}>Drama non trovato 😔</p>;
  }

  const isFavorite = favorites.some((fav) => fav.id === drama.id);

  return (
    <section className={styles.dramaDetails}>
      {/* hero */}
      <div className={styles.dramaHero}>
        <img
          src={`http://localhost:3001${drama.coverImage}`}
          alt={drama.title}
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <NavLink to="/dramaList" className={styles.backBtn}>
            <ArrowLeft size={18} /> Torna alla lista
          </NavLink>

          <div className={styles.dramaTags}>
            {drama.category && (
              <span className={`${styles.tag} ${styles.primary}`}>
                {drama.category}
              </span>
            )}
            {drama.status && (
              <span className={`${styles.tag} ${styles.secondary}`}>
                {drama.status}
              </span>
            )}
          </div>

          <h1 className={styles.dramaTitle}>{drama.title}</h1>

          <div className={styles.dramaMeta}>
            {drama.rating && (
              <div className={`${styles.metaItem} ${styles.rating}`}>
                <Star size={16} fill="#f5c518" stroke="none" />
                <span>{drama.rating}</span>
              </div>
            )}
            {drama.year && <div className={styles.metaItem}>{drama.year}</div>}
            {drama.episodes && (
              <div className={styles.metaItem}>{drama.episodes} episodi</div>
            )}
          </div>

          <div className={styles.dramaActions}>
            <button
              className={`${styles.favBtn} ${isFavorite ? styles.active : ""}`}
              onClick={() => toggleFavorite(drama)}
            >
              <Heart
                size={18}
                fill={isFavorite ? "#fff" : "none"}
                strokeWidth={2}
              />
              {isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            </button>
            <a href={drama.trailerUrl} target="_blank" rel="noopener noreferrer" className={styles.trailerBtn}>
              <Video size={18} />
              Guarda trailer
            </a>
          </div>
        </div>
      </div>

      {/* contenuto principale */}
      <div className={styles.dramaMain}>
        <div className={styles.rightCol}>
          <div className={`${styles.box} ${styles.infoBox}`}>
            <h2>Informazioni</h2>
            <ul>
              <li>
                <Calendar size={18} />
                <strong>Anno:</strong> {drama.year || "—"}
              </li>
              <li>
                <Tv size={18} />
                <strong>Episodi:</strong> {drama.episodes || "—"}
              </li>
              {drama.network && (
                <li>
                  <Tv size={18} />
                  <strong>Rete:</strong> {drama.network}
                </li>
              )}
              {drama.director && (
                <li>
                  <UserRound size={18} />
                  <strong>Regia:</strong> {drama.director}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.leftCol}>
          <div className={styles.box}>
            <h2>Trama</h2>
            <p>{drama.description || "Descrizione non disponibile."}</p>
          </div>

          {drama.mainActors && (
            <div className={styles.box}>
              <h2>Cast Principale</h2>
              <div className={styles.tagList}>
                {drama.mainActors.map((actor, i) => (
                  <span key={i} className={`${styles.tag} ${styles.actor}`}>
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {drama.tags && (
            <div className={styles.box}>
              <h2>Generi</h2>
              <div className={styles.tagList}>
                {drama.tags.map((genre, i) => (
                  <span key={i} className={`${styles.tag} ${styles.genre}`}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DramaDetails;

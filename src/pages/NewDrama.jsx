import { useRef } from "react";
import { useDramaContext } from "../context/dramaContext";
import styles from "./NewDrama.module.css";
import { toast } from 'react-toastify';
const { VITE_API_URL } = import.meta.env;

const NewDrama = () => {
  const { setReloadCompare, setReloadDramaList } = useDramaContext();



  // === Refs per i campi ===
  const titleRef = useRef();
  const descriptionRef = useRef();
  const yearRef = useRef();
  const episodesRef = useRef();
  const ratingRef = useRef();
  const directorRef = useRef();
  const networkRef = useRef();
  const posterRef = useRef();
  const categoryrRef = useRef();



  const addDrama = async (drama) => {
    try {
      const resp = await fetch(`${VITE_API_URL}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },  // 👈 dice al server che il corpo è JSON
          body: JSON.stringify(drama)
        }
      );

      if (!resp.ok) {
        throw new Error(`Errore http: ${resp.status}`);
      };

      const data = await resp.json();
      console.log(data);

      //setDramas(prev => [...prev, data.dramacoreani])

    } catch (error) {
      alert("Errore: Non è stato possibile aggiungere il Drama")
    }
  };

  // === Gestione submit (per ora log demo) ===
  const handleSubmit = (e) => {
    e.preventDefault();

    const newDrama = {
      title: titleRef.current.value,
      category: categoryrRef.current.value,
      description: descriptionRef.current.value,
      director: "Park Shin-woo",
      episodes: Number(episodesRef.current.value),
      year: Number(yearRef.current.value),
      rating: Number(ratingRef.current.value),
      platform: networkRef.current.value,
      coverImage: posterRef.current.value,
      mainActors: [],                           // array vuoto o da gestire con un campo input multiplo
      language: "Coreano",                      // valore di default, modificabile in futuro
      subtitles: ["Italiano"],                  // array con valori base
      duration: 70,                             // puoi gestirlo come campo opzionale
      tags: [],
      status: "Completo",
      network: "Netflix Original",
      slug: "Black Knight",
      trailerUrl: "https://www.youtube.com/watch?v=blackKnightTrailer",                           // da popolare in futuro con un input apposito
    };


    addDrama(newDrama);
    toast.success("Nuovo drama aggiunto");
    setReloadCompare(true);
    setReloadDramaList(true);

  };

  return (
    <section className={styles.newDramaPage}>
      <h1 className={styles.formTitle}>Nuovo Drama</h1>
      <p className={styles.formSubtitle}>
        Aggiungi un nuovo drama alla collezione
      </p>

      <form className={styles.dramaForm} onSubmit={handleSubmit}>
        <label>Titolo</label>
        <input ref={titleRef} type="text" />

        <label>Categoria</label>
        <input ref={categoryrRef} type="text" />

        <label>Descrizione</label>
        <textarea ref={descriptionRef}></textarea>

        <div className={styles.formRow}>
          <div>
            <label>Anno</label>
            <input ref={yearRef} type="number" />
          </div>
          <div>
            <label>Episodi</label>
            <input ref={episodesRef} type="number" />
          </div>
          <div>
            <label>Rating (0-10)</label>
            <input ref={ratingRef} type="number" />
          </div>
        </div>

        <label>Regista</label>
        <input ref={directorRef} type="text" />

        <label>Piattaforma</label>
        <input ref={networkRef} type="text" placeholder="Es. tvN, Netflix" />

        <label>URL Poster</label>
        <input ref={posterRef} type="text" />

        <div className={styles.formButtons}>
          <button type="submit" className={styles.createBtn}>
            Crea Drama
          </button>
          <button type="button" className={styles.cancelBtn}>
            Annulla
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewDrama;

import { useState, useEffect, useRef } from "react";
import { useDramaContext } from "../context/dramaContext";
import { toast } from "react-toastify"
//import useStorage from "../hooks/useStorage";
import { X, Plus, Search, Star } from "lucide-react";
import styles from "./Compare.module.css";

function Compare() {

  const { dramas, fetchAllDramas } = useDramaContext();

    useEffect(() => {
        fetchAllDramas();
    }, []);

  // Ogni slot rappresenta un "contenitore" di un drama
  const [slots, setSlots] = useState([
    { id: 1, drama: null },
    { id: 2, drama: null },
  ]);


  const [nextId, setNextId] = useState(3); // ID progressivo per i nuovi slot
  const [activeSlotId, setActiveSlotId] = useState(null); // Slot attualmente aperto (popup visibile)


  // === STATI PER LA RICERCA NELLA POPUP ===
  const [showSearch, setShowSearch] = useState(false); // mostra/nasconde l’input di ricerca
  const [search, setSearch] = useState("");

  const listDramaRef = useRef(null); // 🔹 riferimento al containerListDrama



  // GESTIONE PER CHIUDERE LA LISTA CLICCANDO FUORI LO SLOT O IL POPUP
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 🔸 Se il click non è dentro al popup, chiudilo
      if (listDramaRef.current && !listDramaRef.current.contains(event.target)) {
        closePopup()
      }
    };

    // 🔹 Aggiungo l’ascoltatore di click
    document.addEventListener("mousedown", handleClickOutside);

    // 🔹 Rimuovo l’ascoltatore quando il componente si smonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  // Apre la lista per scegliere un drama in uno slot specifico
  const openPopup = (slotId) => {
    setActiveSlotId(slotId);
    setShowSearch(false);
  };




  // Chiude la popup e resetta i campi di ricerca
  const closePopup = () => {
    setActiveSlotId(null);
    setShowSearch(false);
    setSearch("");
  };




  // Assegna un drama selezionato a uno slot
  const handleSelectDrama = (slotId, drama) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, drama } : s));
    closePopup(); // chiude la popup dopo la selezione
  };




  // AGGIUNGE UN NUOVO SLOT (SOLO SE TUTTI GLI ALTRI SONO PIENI)
  const addSlot = () => {
    const tuttiSelezionati = slots.every(s => s.drama !== null);
    if (!tuttiSelezionati) {
      toast.info("Devi prima scegliere un drama in tutti gli slot esistenti!");
      return;
    }

    setSlots(prev => [...prev, { id: nextId, drama: null }]);
    setNextId(n => n + 1);
  }




  // RIMUOVE UN DRAMA O UNO SLOT INTERO
  const removeDrama = (slotId) => {
    if (slots.length > 2) {
      // Se ci sono più di 2 slot rimuovo completamente quello selezionato
      setSlots(prev => prev.filter((s) => s.id !== slotId));
    } else {
      // Se sono solo 2 slot svuoto il drama ma lascio lo slot
      setSlots(prev =>
        prev.map(s => (s.id === slotId ? { ...s, drama: null } : s))
      );
    }
  };




  // FILTRO DI RICERCA DEI DRAMA 
  const filteredDramas = dramas.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );




  // Lista dei drama effettivamente selezionati (non null)
  const selected = slots.map(s => s.drama).filter(Boolean);




  return (
    <section className={styles.comparePage}>

      <h2 className={styles.title}>Confronta i Drama</h2>

      <p className={styles.subtitle}>
        Seleziona due o più drama per confrontarli tra loro.
      </p>



      {/* CONTENITORE SLOTS */}
      <div className={styles.containerSlots}>
        {slots.map(slot => {

          const isActive = activeSlotId === slot.id;

          return (

            // SLOT
            <div
              key={slot.id}
              className={`${styles.slot}`}>

              {/* Se lo slot ha un drama */}
              {slot.drama ? (
                <div className={styles.dramaSelected}>

                  <button className={styles.removeBtn} onClick={() => removeDrama(slot.id)}>
                    <X size={18} />
                  </button>

                  <img
                    src={`http://localhost:3001${slot.drama.coverImage}`}
                    alt={slot.drama.title}
                  />

                  <h3>{slot.drama.title}</h3>

                  <p className={styles.category}>{slot.drama.category}</p>
                </div>

              ) : (

                // Slot vuoto permette di aprire la popup per scegliere un drama
                <div className={`${styles.emptySlot}`} onClick={() => openPopup(slot.id)}>

                  {/* Icona "+" visibile finché non è attivo */}
                  {!isActive && <Plus size={38} />}

                  {/* Quando lo slot è attivo mostra la popup */}
                  {isActive && (
                    <div ref={listDramaRef} className={styles.containerListDrama}>

                      {/* HEADER DELLA POPUP */}
                      <div className={styles.listDramaHeader}>
                        {showSearch ? (
                          // 🔍 Campo di ricerca attivo
                          <input
                            type="text"
                            placeholder="Cerca un drama..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          // Titolo + icone 
                          <>
                            <span>Scegli un drama</span>
                            <div className={styles.iconeHeader}>

                              <Search
                                onClick={e => {
                                  e.stopPropagation(); // ⛔ impedisce che il click raggiunga il div genitore
                                  setShowSearch(true);
                                }}
                                size={18}
                              />

                              <X
                                onClick={(e) => {
                                  e.stopPropagation(); // ⛔ impedisce che il click raggiunga il div genitore
                                  closePopup();
                                }}
                                size={18}
                                color={"red"}
                              />

                            </div>
                          </>
                        )}
                      </div>

                      {/* LISTA DRAMA FILTRATA */}
                      <ul className={styles.listDrama}>
                        {filteredDramas.length > 0 ? (
                          filteredDramas.map(d => (
                            <li
                              key={d.id}
                              className={styles.itemListDrama}
                              onClick={e => {
                                e.stopPropagation(); // ⛔ impedisce che il click raggiunga il div genitore
                                handleSelectDrama(slot.id, d);
                              }}
                            >
                              <img src={`http://localhost:3001${d.coverImage}`} alt={d.title} />
                              <div>
                                <h4>{d.title}</h4>
                                <p>{d.category}</p>
                              </div>
                            </li>
                          ))
                        ) : (
                          // Nessun risultato
                          <li
                            style={{
                              textAlign: "center",
                              padding: "12px 0",
                              fontSize: "0.9rem",
                              color: "#666",
                            }}
                          >
                            Nessun drama trovato
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}


        {/* Bottone per aggiungere nuovi slot */}
        <button
          className={styles.addSlotBtn}
          onClick={addSlot}
          disabled={slots.some(s => s.drama === null)}
        >
          + Aggiungi slot
        </button>

      </div>



      {/* ===================== TABELLA DI CONFRONTO ===================== */}
      {selected.length >= 2 && (
        <div className={styles.comparisonTable}>
          
          <h3 className={styles.tableTitle}>Tabella di confronto</h3>
          <div className={styles.tableScroll}>
            <table>

              <thead>

                <tr>
                  <th>Caratteristica</th>
                  {selected.map(d => (
                    <th key={d.id}>{d.title}</th>
                  ))}
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Categoria</td>
                  {selected.map(d => (
                    <td key={d.id}>{d.category || "—"}</td>
                  ))}
                </tr>

                <tr>
                  <td>Anno</td>
                  {selected.map(d => (
                    <td key={d.id}>{d.year || "—"}</td>
                  ))}
                </tr>

                <tr>
                  <td>Episodi</td>
                  {selected.map(d => (
                    <td key={d.id}>{d.episodes || "—"}</td>
                  ))}
                </tr>

                <tr>
                  <td>Valutazione</td>
                  {selected.map(d => (
                    <td key={d.id} ><Star size={16} fill="#f5c518" stroke="none" className={styles.rating} /> {d.rating || "—"}</td>
                  ))}
                </tr>

                <tr>
                  <td>Durata</td>
                  {selected.map(d => (
                    <td key={d.id}>{d.duration || "—"} min</td>
                  ))}
                </tr>

                <tr>
                  <td>Descrizione</td>
                  {selected.map(d => (
                    <td key={d.id}>
                      {d.description}
                    </td>
                  ))}
                </tr>

              </tbody>

            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Compare;

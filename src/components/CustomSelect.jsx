import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./CustomSelect.module.css";



function CustomSelect({ options, value, onChange = () => {}, placeholder, icon }) {


  // Controlla se il menu è aperto o chiuso
  const [open, setOpen] = useState(false);

  // Ref per rilevare clic fuori dal menu
  const ref = useRef(null);


  // Chiude il menu se l’utente clicca fuori dal componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trova l’etichetta del valore attuale
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    // === WRAPPER PRINCIPALE ===
    <div className={styles.customSelect} ref={ref}>

      <div
        className={`${styles.selected} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
      >
        {icon}
        {/* Testo selezionato o placeholder */}
        {currentLabel || placeholder}

        {/* Icona freccia dinamica (su/giù) */}
        <span className={styles.arrow}>
          {open ? (
            <ChevronUp size={16} strokeWidth={2} />
          ) : (
            <ChevronDown size={16} strokeWidth={2} />
          )}
        </span>
      </div>

      {/* LISTA OPZIONI */}
      {open && (
        <ul className={styles.options}>
          {options.map(opt => (
            <li
              key={opt.value}
              className={opt.value === value ? styles.selectedOption : ""}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>

          ))}
        </ul>
      )}
    </div>
  );
}


export default CustomSelect;

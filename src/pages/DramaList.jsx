//hooks react
import { useEffect, useRef, useMemo } from "react";

//context
import { useDramaContext } from "../context/dramaContext";

//hooks custom
import useFilterParams from "../hooks/useFilterParams.js";

//router
import { NavLink } from "react-router-dom";

//icons
import { Plus, Search, SlidersHorizontal, ArrowDownUp } from "lucide-react";
import { ClipLoader } from "react-spinners"

//components
import DramaCard from "../components/DramaCard";
import CustomSelect from "../components/CustomSelect";
import styles from "./DramaList.module.css";





const DramaList = () => {
  const {
    dramas,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sortOrder,
    setSortOrder,
    loading,
    categories,
    fetchDramasByParams,
    lastParamsRef,
    reloadDramaList,
    setReloadDramaList,
    firstMountDramaList
  } = useDramaContext();


  const { getParam, setParam, setParams, paramsString } = useFilterParams();

  const isResetting = useRef(false);



  useEffect(() => {
    const [valueSearch, valueCategory, valueSort] = getParam("search", "category", "sort");
    setSearch(valueSearch);
    setCategoryFilter(valueCategory);
    setSortOrder(valueSort);
  }, [])

  //debounce
  useEffect(() => {

    // PRIMO MONTAGGIO SE ESISTE UN VALORE NELL'INPUT → applico subito il filtro (per evitare flash di tutti i drama caricati)
    // senza causerebbe una chiamata di tutti i drama per via del debounce che ritarda la scrittura della query
    if (firstMountDramaList.current) {


      if (search) {
        setParam("search", search);
      };
      return;
    };


    // salta il debounce se l'input viene svuotato
    if (search === "") {
      setParam("search", "");
      return;
    }

    const timer = setTimeout(() => {
      setParam("search", search);
    }, 500);


    // pulisce il timer precedente (cleanup)
    return () => clearTimeout(timer);

  }, [search]);



  useEffect(() => {

  // ===  PROTEZIONE DURANTE IL RESET ===
  if (isResetting.current) {

    // Sblocca solo quando TUTTI i filtri + params sono resettati
    if (
      paramsString === "" &&
      search === "" &&
      categoryFilter === "" &&
      sortOrder === ""
    ) {
      // Ora la situazione è stabile → sblocco
      isResetting.current = false;
    } else {
      // Stato ancora instabile → blocca tutto
      return;
    }
  }


  // ===  RESET DOPO AGGIUNTA DRAMA ===
  if (reloadDramaList) {
    isResetting.current = true; // blocca gli useEffect successivi
    setReloadDramaList(false);

    // Reset filtri
    setSearch("");
    setCategoryFilter("");
    setSortOrder("");

    // Reset URL params
    setParams(new URLSearchParams(), { replace: true });

    // Reset ultimi parametri memorizzati
    lastParamsRef.current = "";

    // Fetch senza parametri
    fetchDramasByParams("");
    console.log("chiamata per aggiunta drama");

    return; // termina qui finché non si stabilizza
  }



  // === PRIMO MONTAGGIO ===
  if (firstMountDramaList.current) {
    firstMountDramaList.current = false;

    if (lastParamsRef.current === "") {
      fetchDramasByParams(paramsString);
      lastParamsRef.current = paramsString;
      console.log("chiamata al primo montaggio");
    }

    return;
  }



  // === EVITA CHIAMATE DUPLICATE ===
  if (lastParamsRef.current === paramsString) {
    return;
  }



  // === CHIAMATA NORMALE (dopo primo montaggio) ===
  fetchDramasByParams(paramsString);
  console.log("chiamata dopo il primo montaggio");

  lastParamsRef.current = paramsString;

}, [paramsString, reloadDramaList]);




  // OPZIONI DI ORDINAMENTO (label/valore separati) 
  const sortOptions = [
    { label: "Ordina per...", value: "" },
    { label: "Titolo (A-Z)", value: "title-asc" },
    { label: "Titolo (Z-A)", value: "title-desc" },
    { label: "Categoria (A-Z)", value: "category-asc" },
    { label: "Categoria (Z-A)", value: "category-desc" },
  ];

  const sortedDramas = useMemo(() => {
    const sorted = [...dramas];
    switch (sortOrder) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "category-asc":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      case "category-desc":
        return sorted.sort((a, b) => b.category.localeCompare(a.category));
      default:
        return sorted;
    }
  }, [dramas, sortOrder]);




  return (

    <section className={styles.dramaListPage}>

      {/* --- HERO --- */}
      <div className={styles.heroSection}>

        <h1 className={styles.heroTitle}>Scopri i Migliori K-Drama</h1>

        <p className={styles.heroSubtitle}>
          Esplora la nostra collezione curata di drama coreani, dai classici
          senza tempo alle ultime uscite.
        </p>

        <NavLink to="/newDrama" className={styles.addDramaBtn}>
          <Plus size={18} />
          Aggiungi Nuovo Drama
        </NavLink>

      </div>



      {/* --- FILTRI --- */}
      <div className={styles.filterBar}>

        {/* 🔍 RICERCA */}
        <div className={styles.filterInput}>

          <Search className={styles.filterIconSearch} size={18} />

          <input
            type="text"
            placeholder="Cerca drama..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>




        {/* 🎭 CATEGORIA */}
        <div className={`${styles.filterSelect} ${styles.filterCat}`}>

          <CustomSelect
            icon={<SlidersHorizontal size={18} />}
            options={categories.map(cat => ({ label: cat, value: cat }))}
            value={categoryFilter}
            onChange={(value) => {
              if (value === "Tutte le categorie") {
                setCategoryFilter("");
                setParam("category", "");
                return;
              }

              setCategoryFilter(value);
              setParam("category", value);
            }}
            placeholder="Tutte le categorie"
          />

        </div>




        {/* 🔡 ORDINAMENTO */}
        <div className={`${styles.filterSelect} ${styles.filterSort}`}>

          <CustomSelect
            icon={<ArrowDownUp size={18} />}
            options={sortOptions}
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setParam("sort", value);
            }}
            placeholder="Ordina per..."
          />

        </div>

      </div>



      {/* --- COUNTER --- */}
      <p className={styles.dramaCount}>{dramas.length} drama trovati</p>




      {/* --- GRIGLIA --- */}
      {loading
        ?

        <ClipLoader size={30} color="#592ea1" />

        :

        <div className={styles.dramaGrid}>

          {sortedDramas.map((drama) => (
            <div key={drama.id} className={styles.col}>
              <DramaCard drama={drama} />
            </div>))}

        </div>}

    </section>
  );
}

export default DramaList;

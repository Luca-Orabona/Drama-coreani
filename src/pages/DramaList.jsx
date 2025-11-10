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
    categoriesRef,
    fetchParams
  } = useDramaContext();

  const firstMount = useRef(true);

  const { getParam, setParam, paramsString } = useFilterParams();

  useEffect(() => {
    const [valueSearch, valueCategory, valueSort] = getParam("search", "category", "sort");
    setSearch(valueSearch);
    setCategoryFilter(valueCategory);
    setSortOrder(valueSort);
  }, [])

  //debounce
  useEffect(() => {
    if (search === "") {
      setParam("search", "");
      return;
    }

    const timer = setTimeout(() => {
      setParam("search", search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);



  useEffect(() => {
    //al primo montaggio non esegue la fetch
    if (firstMount.current) {
      firstMount.current = false;
      return
    };

    fetchParams(paramsString)
  }, [paramsString])



  // === OPZIONI DI ORDINAMENTO (label/valore separati) ===
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
            //onKeyDown={handleKeyDown}
            placeholder="Cerca drama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🎭 CATEGORIA */}
        <div className={styles.filterSelect}>
          <CustomSelect
            icon={<SlidersHorizontal size={18} />}
            options={categoriesRef.current.map(cat => ({ label: cat, value: cat }))}
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
        <div className={styles.filterSelect}>
          <CustomSelect
            icone={<ArrowDownUp size={18} />}
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

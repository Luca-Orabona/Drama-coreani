import { createContext, useContext, useState, useEffect, useRef } from "react";
import useStorage from "../hooks/useStorage";
const { VITE_API_URL } = import.meta.env;

const DramaContext = createContext();


export const DramaProvider = ({ children }) => {

    const [allDramas, setAllDramas] = useState([]);
    const [dramas, setDramas] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useStorage("favorites", []);
    const [categories, setCategories] = useState([]);
    const [reloadCompare, setReloadCompare] = useState(false);
    const [reloadDramaList, setReloadDramaList] = useState(false);

    // REFERENZA del primo montaggio per pagina CONFRONTO (per non fare fetch ogni volta che si ritorna sulla pagina)
    const firstMount = useRef(true);

    // REFERENZA del primo montaggio per pagina DRAMALIST 
    // permette di scrivere subito la query SEARCH(SE ESISTE) nell'url evitando la chiamata che causa un flash
    // dovuto alla chiamata di tutti i drama causata dal debaunce
    const firstMountDramaList = useRef(true);

    const lastParamsRef = useRef("");


    const fetchJson = async (url) => {
        const resp = await fetch(url);
        const obj = await resp.json();
        return obj;
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchJson(`${VITE_API_URL}`);

                setCategories(["Tutte le categorie", ...new Set(data.map(d => d.category))]);

            } catch (err) {
                console.error("Errore categorie:", err);
            }
        };

        loadCategories();
    }, []);



    //chimata iniziale
    const fetchAllDramas = async () => {
        console.log("prima chiamata dal context");

        setLoading(true)
        try {
            const data = await fetchJson(`${VITE_API_URL}`)
            setAllDramas(data);   // lista completa
            console.log(data);

        } catch (error) {
            console.error("Errore nel caricamento dei drama:", error);
        } finally {
            setLoading(false);
        }
    };






    //richiesta fetch  con i parametri
    const fetchDramasByParams = async (paramsString) => {

        // Evita fetch duplicate quando i parametri non cambiano.
        // al primo avvio sia lastParamsRef.current che paramsString sono "".
        // In quel caso la fetch DEVE partire, quindi blocco SOLO se i parametri coincidono
        // e NON sono stringa vuota.
        if (lastParamsRef.current === paramsString && lastParamsRef.current !== "") {
            return;
        }


        lastParamsRef.current = paramsString; // aggiorno il riferimento

        console.log("chiamata con i parametri");
        setLoading(true)
        try {
            const data = paramsString
                ? await fetchJson(`${VITE_API_URL}?${paramsString}`)
                : await fetchJson(`${VITE_API_URL}`)
            setDramas(data)

        } catch (error) {
            console.error("Errore nel caricamento dei drama:", error);
        } finally {
            setLoading(false);
        }
    };




    // Funzione per trovare un drama specifico tramite il suo ID
    const getDramaBySlug = (slug) => {
        console.log(slug);
        return dramas.find(drama => drama.slug === slug);

    };


    // Aggiungi drama ai preferiti
    const addFavorite = (drama) => {
        if (!favorites.find(fav => fav.id === drama.id)) {
            setFavorites([...favorites, drama]);
        }
    };

    // Rimuovi drama dai preferiti
    const removeFavorite = (dramaId) => {
        setFavorites(favorites.filter(fav => fav.id !== dramaId));
    };

    // Funzione di toggle per preferiti
    const toggleFavorite = (drama) => {
        if (favorites.find(fav => fav.id === drama.id)) {
            removeFavorite(drama.id);
        } else {
            addFavorite(drama);
        }
    };


    return (
        <DramaContext.Provider
            value={{
                allDramas,
                setAllDramas,
                dramas,
                setDramas,
                search,
                setSearch,
                categoryFilter,
                setCategoryFilter,
                categories,
                sortOrder,
                setSortOrder,
                loading,
                getDramaBySlug,
                favorites,
                setFavorites,
                toggleFavorite,
                fetchDramasByParams,
                fetchAllDramas,
                lastParamsRef,
                firstMount,
                firstMountDramaList,
                reloadCompare,
                setReloadCompare,
                reloadDramaList,
                setReloadDramaList
            }}
        >
            {children}
        </DramaContext.Provider>
    );
};

export const useDramaContext = () => useContext(DramaContext);

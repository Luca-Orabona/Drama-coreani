import { createContext, useContext, useState, useEffect, useRef } from "react";
import useStorage from "../hooks/useStorage";
const { VITE_API_URL } = import.meta.env;

const DramaContext = createContext();


export const DramaProvider = ({ children }) => {
    const [dramas, setDramas] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useStorage("favorites", []);
    

    const categoriesRef = useRef([]);


    const fetchJson = async (url) => {
        const resp = await fetch(url);
        const obj = await resp.json();
        return obj;
    };


    //chimata iniziale
    const fetchInitial = async () => {
        console.log("prima chiamata dal context");

        setLoading(true)
        try {
            const data = await fetchJson(`${VITE_API_URL}`)
            setDramas(data)
            console.log(data);

            // estraggo categorie UNA SOLA VOLTA
            const unique = Array.from(new Set(data.map(d => d.category)));

            // memorizzo nella ref
            categoriesRef.current = ["Tutte le categorie", ...unique];
            setCategories(categoriesRef.current);

        } catch (error) {
            console.error("Errore nel caricamento dei drama:", error);
        } finally {
            setLoading(false);
        }
    };
    //chimata iniziale
    useEffect(() => {
        fetchInitial();
    }, []);

    //richiesta fetch  con i parametri
    const fetchParams = async (paramsString) => {
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
    const getDramaById = (id) => {
        return dramas.find(drama => drama.id === parseInt(id));
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
                dramas,
                setDramas,
                search,
                setSearch,
                categoryFilter,
                setCategoryFilter,
                categoriesRef,
                sortOrder,
                setSortOrder,
                loading,
                getDramaById,
                favorites,
                setFavorites,
                toggleFavorite,
                fetchParams,
            }}
        >
            {children}
        </DramaContext.Provider>
    );
};

export const useDramaContext = () => useContext(DramaContext);

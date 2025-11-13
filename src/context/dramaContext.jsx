import { createContext, useContext, useState, useEffect, useRef } from "react";
import useStorage from "../hooks/useStorage";
const { VITE_API_URL } = import.meta.env;

const DramaContext = createContext();


export const DramaProvider = ({ children }) => {

    const [dramas, setDramas] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useStorage("favorites", []);


    const categoriesRef = useRef([]);



    const fetchJson = async (url) => {
        const resp = await fetch(url);
        const obj = await resp.json();
        return obj;
    };


    //chimata iniziale
    const fetchAllDramas = async () => {
        console.log("prima chiamata dal context");

        setLoading(true)
        try {
            const data = await fetchJson(`${VITE_API_URL}`)
            setDramas(data)
            console.log(data);

            // estraggo categorie UNA SOLA VOLTA
            categoriesRef.current = ["Tutte le categorie", ...new Set(data.map(d => d.category))];


        } catch (error) {
            console.error("Errore nel caricamento dei drama:", error);
        } finally {
            setLoading(false);
        }
    };
    
 

    //richiesta fetch  con i parametri
    const fetchDramasByParams = async (paramsString) => {
        console.log("chiamata con i parametri");
        setLoading(true)
        try {
            const data = paramsString
                ? await fetchJson(`${VITE_API_URL}?${paramsString}`)
                : await fetchJson(`${VITE_API_URL}`)
            setDramas(data)

            // estraggo categorie UNA SOLA VOLTA
            categoriesRef.current = ["Tutte le categorie", ...new Set(data.map(d => d.category))];

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
                getDramaBySlug,
                favorites,
                setFavorites,
                toggleFavorite,
                fetchDramasByParams,
                fetchAllDramas
            }}
        >
            {children}
        </DramaContext.Provider>
    );
};

export const useDramaContext = () => useContext(DramaContext);

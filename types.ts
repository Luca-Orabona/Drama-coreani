export type DramaCoreani = {
  id: number; 
  slug: string;                // identificatore unico - obbligatorio
  title: string;              // obbligatorio
  category: string;           // obbligatorio
  description?: string;       // descrizione trama
  status?: string;            // es: "Completo" o "In corso"
  network?: string;           // rete / canale originale (tvN, JTBC...)
  director?: string;          // nome del regista
  episodes?: number;          // numero episodi
  year?: number;              // anno di uscita
  rating?: number;            // valutazione media da 0 a 10
  platform?: string;          // es: Netflix, Viki
  coverImage?: string;        // URL copertina
  mainActors?: string[];      // lista attori principali
  language?: string;          // lingua originale
  subtitles?: string[];       // sottotitoli disponibili
  duration?: number;          // durata media in minuti
  tags?: string[];            // generi/parole chiave
  trailerUrl?: string;        // link del trailer        
};


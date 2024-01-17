type Medias = {
    name: string;
    path: string;
    type: "movie" | "series"; // Entweder "movie" oder "series"
    tmdb: {
      // Gemeinsame Felder für Filme und Serien
      adult?: boolean;
      backdrop_path: string;
      belongs_to_collection?: null;
      budget?: number;
      genres: Array<{
        id: number;
        name: string;
      }>;
      homepage?: string;
      id?: number;
      imdb_id?: string;
      original_language?: string;
      original_title?: string;
      overview?: string;
      popularity?: number;
      poster_path?: string;
      production_companies?: Array<{
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
      }>;
      production_countries?: Array<{
        iso_3166_1: string;
        name: string;
      }>;
      release_date?: string;
      revenue?: number;
      runtime?: number;
      spoken_languages?: Array<{
        english_name: string;
        iso_639_1: string;
        name: string;
      }>;
      status?: string;
      tagline?: string;
      title?: string;
      video?: boolean;
      vote_average?: number;
      vote_count?: number;
  
      // Zusätzliche Felder für Serien
      created_by?: Array<{
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string;
      }>;
      episode_run_time?: Array<number>;
      first_air_date?: string;
      last_air_date?: string;
      last_episode_to_air?: {
        id: number;
        name: string;
        overview: string;
        vote_average: number;
        vote_count: number;
        air_date: string;
        episode_number: number;
        episode_type: string;
        production_code: string;
        runtime: number;
        season_number: number;
        show_id: number;
        still_path: string | null;
      };
      networks?: Array<{
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
      }>;
      number_of_episodes?: number;
      number_of_seasons?: number;
      origin_country?: Array<string>;
      original_name?: string;
      seasons?: Array<{
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
        vote_average: number;
      }>;
  
      // Weitere Felder für Serien
      type?: string;
    };
  }[];
  


  type Media = {
    name: string;
    path: string;
    type: "movie" | "series"; // Entweder "movie" oder "series"
    tmdb: {
      // Gemeinsame Felder für Filme und Serien
      adult?: boolean;
      backdrop_path: string;
      belongs_to_collection?: null;
      budget?: number;
      genres: Array<{
        id: number;
        name: string;
      }>;
      homepage?: string;
      id?: number;
      imdb_id?: string;
      original_language?: string;
      original_title?: string;
      overview?: string;
      popularity?: number;
      poster_path?: string;
      production_companies?: Array<{
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
      }>;
      production_countries?: Array<{
        iso_3166_1: string;
        name: string;
      }>;
      release_date?: string;
      revenue?: number;
      runtime?: number;
      spoken_languages?: Array<{
        english_name: string;
        iso_639_1: string;
        name: string;
      }>;
      status?: string;
      tagline?: string;
      title?: string;
      video?: boolean;
      vote_average?: number;
      vote_count?: number;
  
      // Zusätzliche Felder für Serien
      created_by?: Array<{
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string;
      }>;
      episode_run_time?: Array<number>;
      first_air_date?: string;
      last_air_date?: string;
      last_episode_to_air?: {
        id: number;
        name: string;
        overview: string;
        vote_average: number;
        vote_count: number;
        air_date: string;
        episode_number: number;
        episode_type: string;
        production_code: string;
        runtime: number;
        season_number: number;
        show_id: number;
        still_path: string | null;
      };
      networks?: Array<{
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
      }>;
      number_of_episodes?: number;
      number_of_seasons?: number;
      origin_country?: Array<string>;
      original_name?: string;
      seasons?: Array<{
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
        vote_average: number;
      }>;
  
      // Weitere Felder für Serien
      type?: string;
    };
  };
  


  type TMDBMovie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  };
  
  type ResultTMDB = {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
  }; {}


  type Settings = {
    language: string;
    keywords: string[]
  }
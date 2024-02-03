import { get } from "svelte/store";
import { settings } from "./db";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2QzNTk3MGMxNDI1ZDAyNjNlODgxOTc2YjdkMGE2OCIsInN1YiI6IjYzYmZjYzQzZTE2ZTVhMDA3ZWE5NmVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-0B4iiurqQ7Pf5axF1WarNlXLOhhytlby5xpulvs1U4"
export const imageURL = "https://image.tmdb.org/t/p/original/"
export const placeholderURL = 'https://via.placeholder.com/300x450'

export async function findMovie(name: string) {
  if (window.navigator.onLine) {throw("Du bist offline")}
  if (name) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        accept: 'application/json'
      }
    };



    try {
      let response = await fetch(`https://api.themoviedb.org/3/search/movie?language=${get(settings).language}&query=` + name, options)

      if (response.ok) {
        let jsonData = await response.json();
        return jsonData;
      } else {
        console.error('Fehlerhafter Response:', response.status, response.statusText);
        throw new Error('Fehlerhafter Response');
      }
    } catch (error) {
      console.error('Fehler bei der Anfrage:', error);
      throw error;
    }
  } else {
    throw ("NAME not found")
  }
}

// https://developer.themoviedb.org/reference/movie-details
export async function getMovie(ID: number) {
  if (window.navigator.onLine) {throw("Du bist offline")}
  if (ID) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    };

    try {
      let response = await fetch(`https://api.themoviedb.org/3/movie/${ID}?language=de-de`, options);

      if (response.ok) {
        let jsonData = await response.json();
        return jsonData;
      } else {
        console.error('Fehlerhafter Response:', response.status, response.statusText);
        throw new Error('Fehlerhafter Response');
      }
    } catch (error) {
      console.error('Fehler bei der Anfrage:', error);
      throw error;
    }
  } else {
    throw new Error("ID not found");
  }
}

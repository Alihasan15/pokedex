import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  getPokemons(start){
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/?offset=${start}&limit=30`);
  }

  getPokemonDetailById(id){
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  }

  getPokemonSpeciesById(id){
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  }
  getPokemonEvolution(url){
    return this.http.get(url);
  }
}

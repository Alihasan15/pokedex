import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, forkJoin, concat } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { scrollTo } from 'scroll-js';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css'],
})
export class PokemonsComponent implements OnInit {
  pokemons: any[] = [];
  start = 1;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAllPokemons(this.start);
    this.scrollEvent();
  }
  getAllPokemons(start) {
    const end = start + 40;
    let pokemonDetailRequests = [];
    this.spinner.show();
    for (let i = start; i < end; i++) {
      pokemonDetailRequests.push(this.apiService.getPokemonDetailById(i));
    }
    forkJoin(pokemonDetailRequests).subscribe((resp) => {
      console.log(resp);
      let pokemonArray = [];
      resp.forEach((item) => {
        let pokemon = {
          id: item['id'],
          name: item['name'],
          image: `https://pokeres.bastionbot.org/images/pokemon/${item['id']}.png`,
          types: item['types'].map((item) => item['type']['name']),
        };
        pokemonArray.push(pokemon);
      });
      Array.prototype.push.apply(this.pokemons, pokemonArray);
      console.log(this.pokemons);
      this.spinner.hide();
    });
  }
  scrollEvent() {
    var self = this;
    const comp = document.querySelector('.pokedex');
    comp.addEventListener('scroll', function (e: any) {
      let pos = e.target.scrollTop + e.target.offsetHeight;
      let max = e.target.scrollHeight;
      max -= 2;
      // console.log({pos,max});
      if (pos >= max) {
        console.log('Bottom Reached');
        self.start += 40;
        self.getAllPokemons(self.start);
      }
    });
  }
}

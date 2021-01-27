import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { pokemonDetails } from './pokemonDetails';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemonDetails: pokemonDetails;
  touchstartX = 0;
  touchstartY = 0;
  touchendX = 0;
  touchendY = 0;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getPokemonDetailByUrl();
    this.clickEvents();
  }

  getPokemonDetailByUrl() {
    this.spinner.show();
    this.route.paramMap.subscribe((params) => {
      let pokemonId = params.get('id');
      console.log(pokemonId);

      const pokemonDetail = this.api.getPokemonDetailById(pokemonId);
      const pokemonSpecies = this.api.getPokemonSpeciesById(pokemonId);
      const combinedRequest = forkJoin([pokemonDetail, pokemonSpecies]);
      combinedRequest.subscribe((resp) => {
        console.log(resp);

        const flavour_text_entry = resp[1]['flavor_text_entries'].find(
          (x) => x['language']['name'] == 'en'
        );
        const flavor_text_value = flavour_text_entry['flavor_text']
          .replace(/[^\x00-\xFF]/g, '')
          .replace(/\n/g, ' ')
          .replace(/\f/g, ' ');
        const genera = resp[1]['genera'].find(
          (x) => x['language']['name'] == 'en'
        );
        const types = resp[0]['types'].map((res) => res.type.name);
        const egg_groups = resp[1]['egg_groups']
          .map(
            (group) =>
              group['name'].charAt(0).toUpperCase() + group['name'].slice(1)
          )
          .join(',');
        const evolutionUrl = resp[1]['evolution_chain']['url'];
        const habitat = resp[1]['habitat']['name'];
        const shape = resp[1]['shape']['name'];
        let total = 0;
        const stats = resp[0]['stats']
          .map((st) => {
            total += st['base_stat'];
            return {
              name: st['stat']['name'],
              value: st['base_stat'],
            };
          })
          .reverse();
        stats.push({ name: 'Total', value: total });
        const moves = resp[0]['moves']
          .map((move) => {
            return {
              name: move['move']['name'],
              level_learned_at:
                move['version_group_details'][0]['level_learned_at'],
            };
          })
          .sort((a, b) => {
            return a.level_learned_at - b.level_learned_at;
          });

        // console.log({flavour_text_entry,genera,types,egg_groups,stats});

        this.pokemonDetails = {
          id: '#' + this.pad(pokemonId, 3),
          name: resp[0]['name'],
          height: this.addUnit(resp[0]['height'], 'm'),
          weight: this.addUnit(resp[0]['weight'], 'kg'),
          types: types,
          image: `https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png`,
          description: flavor_text_value,
          species: genera['genus'],
          egg_groups: egg_groups,
          stats: stats,
          habitat: habitat,
          shape: shape,
          evolution: [],
          moves: moves,
        };
        this.api.getPokemonEvolution(evolutionUrl).subscribe((resp) => {
          console.log(resp);

          let evolve_chain = resp['chain']['evolves_to'];
          while (evolve_chain.length > 0) {
            let name = evolve_chain[0]['species']['name'];
            let spieciesarr = evolve_chain[0]['species']['url'].split('/');
            let id = spieciesarr[6];
            let arrEvolution = Object.keys(
              evolve_chain[0]['evolution_details'][0]
            ).filter(
              (key) =>
                evolve_chain[0]['evolution_details'][0][key] != null &&
                evolve_chain[0]['evolution_details'][0][key] != '' &&
                key != 'trigger'
            );
            let evolve_trigger =
              evolve_chain[0]['evolution_details'][0]['trigger']['name'];
            if (arrEvolution.length <= 0) arrEvolution.push('no-item');
            let evolutionNeed = {
              category: evolve_trigger,
              name: arrEvolution[0],
              value: '',
            };
            if (evolve_trigger == 'level-up') {
              evolutionNeed['value'] =
                evolve_chain[0]['evolution_details'][0][arrEvolution[0]];
              evolutionNeed['name'] = evolutionNeed['name'].slice(4);
            } else if (arrEvolution[0] != 'no-item')
              evolutionNeed['value'] =
                evolve_chain[0]['evolution_details'][0][arrEvolution[0]][
                  'name'
                ];

            let evolution = {
              name: name,
              image: `https://pokeres.bastionbot.org/images/pokemon/${id}.png`,
              evolutionNeed: evolutionNeed,
            };
            console.log(evolution);
            this.pokemonDetails['evolution'].push(evolution);
            evolve_chain = evolve_chain[0]['evolves_to'];
          }
          console.log(this.pokemonDetails);
          this.spinner.hide();
        });
      });
    });
  }

  pad(number, len) {
    var str = '' + number;
    while (str.length < len) {
      str = '0' + str;
    }

    return str;
  }
  addUnit(number, unit) {
    return number / 10 + ' ' + unit;
  }
  handleGesture() {
    if (this.touchendX < this.touchstartX) {
      console.log('Swiped left');
    }

    if (this.touchendX > this.touchstartX) {
      console.log('Swiped right');
    }

    if (this.touchendY < this.touchstartY) {
      console.log('Swiped up');
    }

    if (this.touchendY > this.touchstartY) {
      console.log('Swiped down');
    }

    if (this.touchendY === this.touchstartY) {
      console.log('Tap');
    }
  }
  clickEvents() {
    const gestureZone = document.querySelector('.category-section');
    var self = this;
    gestureZone.addEventListener(
      'touchstart',
      function (event: any) {
        self.touchstartX = event.changedTouches[0].screenX;
        self.touchstartY = event.changedTouches[0].screenY;
      },
      false
    );

    gestureZone.addEventListener(
      'touchend',
      function (event: any) {
        self.touchendX = event.changedTouches[0].screenX;
        self.touchendY = event.changedTouches[0].screenY;
        self.handleGesture();
      },
      false
    );
    let category = document.querySelectorAll('.category');

    category.forEach((cat) => {
      cat.addEventListener('click', function (event: any) {
        let navTo = event.target.dataset.navto;
        self.handleNavigation(navTo);
        let activecategory = document.querySelector('.activecategory');
        activecategory.classList.remove('activecategory');
        event.target.classList.add('activecategory');
      });
    });
  }
  handleNavigation(navTo) {
    let self = this;
    const category_section = document.querySelectorAll('.category-section');
    category_section.forEach((section) => {
      let nav = section.getAttribute('data-nav');
      if (nav == navTo) {
        section.classList.remove('hide');
      } else {
        section.classList.add('hide');
      }
    });
  }
}
// this.api.getPokemonDetailById(pokemonId).subscribe((resp)=>{

//   console.log(resp);

//   this.pokemonDetails={
//     id:'#'+this.pad(pokemonId,3),
//     name:resp["name"],
//     height:this.addUnit(resp["height"],'m'),
//     weight:this.addUnit(resp["weight"],'kg'),
//     types:[],
//     image:`https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png`,
//     description:"",
//     species:""
//   };

//   this.pokemonDetails["types"]=resp["types"].reverse().map(res=>res.type.name);

//   this.api.getPokemonSpeciesById(pokemonId).subscribe((resp)=>{
//     console.log(resp);
//     let flavour_text_entry=resp["flavor_text_entries"].find(x=>x["language"]["name"]=="en");
//     let genera=resp["genera"].find(x=>x["language"]["name"]=="en");
//     console.log({flavour_text_entry,genera});
//     this.pokemonDetails["description"]=flavour_text_entry["flavor_text"];
//     this.pokemonDetails["species"]=genera["genus"];
//   });

//   console.log(this.pokemonDetails);

// });

/*

      
        calculate sum(){

          existing sum=aysnc code ka response;
          observable/promise;
          jab existing sum bhar jaaye tho mai 
          existing sum=undefined;
          existing sum+=10;

        } 
         */
